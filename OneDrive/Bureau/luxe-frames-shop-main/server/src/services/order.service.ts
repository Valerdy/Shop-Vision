import { prisma } from '../config/prisma';
import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { updateStock } from './product.service';

export interface CreateOrderInput {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: PaymentMethod;
  customerNote?: string;
}

/**
 * Génère un numéro de commande unique
 */
const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `LUX-${timestamp}${random}`;
};

/**
 * Crée une nouvelle commande
 */
export const createOrder = async (input: CreateOrderInput) => {
  const { userId, items, shippingAddress, paymentMethod, customerNote } = input;

  // Vérifier que tous les produits existent et ont assez de stock
  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map((item) => item.productId) },
      isActive: true,
    },
  });

  if (products.length !== items.length) {
    throw new Error('Un ou plusieurs produits sont introuvables');
  }

  // Vérifier le stock
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Produit ${item.productId} introuvable`);
    }
    if (product.stock < item.quantity) {
      throw new Error(
        `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}, demandé: ${item.quantity}`
      );
    }
  }

  // Calculer les montants
  let subtotal = 0;
  const orderItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const itemSubtotal = product.price * item.quantity;
    subtotal += itemSubtotal;

    return {
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '',
      price: product.price,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    };
  });

  // Calcul des frais (TVA 0% au Congo, frais de livraison fixes)
  const tax = 0;
  const shippingCost = 5000; // 5000 FCFA de frais de livraison
  const totalAmount = subtotal + tax + shippingCost;

  // Créer la commande avec transaction
  const order = await prisma.$transaction(async (tx) => {
    // Créer la commande
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        status: OrderStatus.PENDING,
        paymentStatus:
          paymentMethod === PaymentMethod.CASH_ON_DELIVERY
            ? PaymentStatus.PENDING
            : PaymentStatus.PENDING,
        paymentMethod,
        subtotal,
        tax,
        shippingCost,
        totalAmount,
        shippingAddress: shippingAddress as Prisma.JsonObject,
        customerNote,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Mettre à jour le stock des produits
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return newOrder;
  });

  return order;
};

/**
 * Récupère toutes les commandes d'un utilisateur
 */
export const getUserOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Récupère une commande par son ID
 */
export const getOrderById = async (orderId: string, userId?: string) => {
  const where: Prisma.OrderWhereUniqueInput = {
    id: orderId,
    ...(userId && { userId }),
  };

  return await prisma.order.findUnique({
    where,
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: true,
              brand: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
  });
};

/**
 * Récupère toutes les commandes (ADMIN)
 */
export const getAllOrders = async (filters: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  page?: number;
  limit?: number;
}) => {
  const { status, paymentStatus, page = 1, limit = 20 } = filters;

  const where: Prisma.OrderWhereInput = {
    ...(status && { status }),
    ...(paymentStatus && { paymentStatus }),
  };

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Met à jour le statut d'une commande (ADMIN)
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  adminNote?: string
) => {
  const data: Prisma.OrderUpdateInput = {
    status,
    ...(adminNote && { adminNote }),
    ...(status === OrderStatus.SHIPPED && { shippedAt: new Date() }),
    ...(status === OrderStatus.DELIVERED && { deliveredAt: new Date() }),
  };

  return await prisma.order.update({
    where: { id: orderId },
    data,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

/**
 * Met à jour le statut de paiement (ADMIN)
 */
export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: PaymentStatus,
  transactionId?: string
) => {
  const data: Prisma.OrderUpdateInput = {
    paymentStatus,
    ...(transactionId && { transactionId }),
    ...(paymentStatus === PaymentStatus.PAID && { paidAt: new Date() }),
  };

  return await prisma.order.update({
    where: { id: orderId },
    data,
  });
};

/**
 * Annule une commande
 */
export const cancelOrder = async (orderId: string, userId: string) => {
  // Récupérer la commande
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error('Commande introuvable');
  }

  if (order.userId !== userId) {
    throw new Error('Non autorisé');
  }

  if (
    order.status === OrderStatus.SHIPPED ||
    order.status === OrderStatus.DELIVERED
  ) {
    throw new Error('Impossible d\'annuler une commande déjà expédiée ou livrée');
  }

  // Annuler la commande et restaurer le stock
  return await prisma.$transaction(async (tx) => {
    // Mettre à jour le statut
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    // Restaurer le stock
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    return updatedOrder;
  });
};

/**
 * Statistiques des commandes (ADMIN)
 */
export const getOrderStats = async () => {
  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: {
        status: {
          in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING],
        },
      },
    }),
    prisma.order.count({
      where: { status: OrderStatus.DELIVERED },
    }),
    prisma.order.aggregate({
      where: {
        paymentStatus: PaymentStatus.PAID,
      },
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    recentOrders,
  };
};
