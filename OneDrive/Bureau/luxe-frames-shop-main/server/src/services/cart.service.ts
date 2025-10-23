import { prisma } from '../config/prisma';

export const getCart = async (userId: string) => {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      addedAt: 'desc',
    },
  });

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return {
    items,
    subtotal,
    itemsCount: items.length,
  };
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number = 1
) => {
  // Vérifier le stock
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || !product.isActive) {
    throw new Error('Produit introuvable');
  }

  if (product.stock < quantity) {
    throw new Error('Stock insuffisant');
  }

  // Vérifier si déjà dans le panier
  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    // Mettre à jour la quantité
    const newQuantity = existing.quantity + quantity;

    if (product.stock < newQuantity) {
      throw new Error('Stock insuffisant');
    }

    return await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQuantity },
      include: { product: true },
    });
  }

  // Créer un nouvel item
  return await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity,
    },
    include: { product: true },
  });
};

export const updateCartItem = async (
  cartItemId: string,
  userId: string,
  quantity: number
) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
    include: { product: true },
  });

  if (!item || item.userId !== userId) {
    throw new Error('Item introuvable');
  }

  if (item.product.stock < quantity) {
    throw new Error('Stock insuffisant');
  }

  return await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
    include: { product: true },
  });
};

export const removeFromCart = async (cartItemId: string, userId: string) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!item || item.userId !== userId) {
    throw new Error('Item introuvable');
  }

  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export const clearCart = async (userId: string) => {
  return await prisma.cartItem.deleteMany({
    where: { userId },
  });
};
