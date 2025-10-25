import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
} from '../services/order.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

/**
 * @route   POST /api/v1/orders
 * @desc    Crée une nouvelle commande
 * @access  Private
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: 'Non authentifié',
    });
    return;
  }

  const { items, shippingAddress, paymentMethod, customerNote } = req.body;

  // Validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({
      success: false,
      message: 'Articles de commande requis',
    });
    return;
  }

  if (!shippingAddress) {
    res.status(400).json({
      success: false,
      message: 'Adresse de livraison requise',
    });
    return;
  }

  if (!paymentMethod) {
    res.status(400).json({
      success: false,
      message: 'Méthode de paiement requise',
    });
    return;
  }

  const order = await createOrder({
    userId: req.userId,
    items,
    shippingAddress,
    paymentMethod,
    customerNote,
  });

  res.status(201).json({
    success: true,
    message: 'Commande créée avec succès',
    data: { order },
  });
});

/**
 * @route   GET /api/v1/orders
 * @desc    Récupère les commandes de l'utilisateur connecté
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: 'Non authentifié',
    });
    return;
  }

  const orders = await getUserOrders(req.userId);

  res.status(200).json({
    success: true,
    data: { orders },
  });
});

/**
 * @route   GET /api/v1/orders/:id
 * @desc    Récupère une commande par ID
 * @access  Private
 */
export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: 'Non authentifié',
    });
    return;
  }

  const { id } = req.params;
  const order = await getOrderById(id, req.userId);

  if (!order) {
    res.status(404).json({
      success: false,
      message: 'Commande non trouvée',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { order },
  });
});

/**
 * @route   PUT /api/v1/orders/:id/cancel
 * @desc    Annule une commande
 * @access  Private
 */
export const cancel = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: 'Non authentifié',
    });
    return;
  }

  const { id } = req.params;
  const order = await cancelOrder(id, req.userId);

  res.status(200).json({
    success: true,
    message: 'Commande annulée avec succès',
    data: { order },
  });
});

/**
 * @route   GET /api/v1/orders/admin/all
 * @desc    Récupère toutes les commandes (ADMIN)
 * @access  Private/Admin
 */
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { status, paymentStatus, page, limit } = req.query;

  const filters = {
    status: status as OrderStatus | undefined,
    paymentStatus: paymentStatus as PaymentStatus | undefined,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  };

  const result = await getAllOrders(filters);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/v1/orders/admin/:id
 * @desc    Récupère une commande par ID (ADMIN)
 * @access  Private/Admin
 */
export const getOrderAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await getOrderById(id);

  if (!order) {
    res.status(404).json({
      success: false,
      message: 'Commande non trouvée',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { order },
  });
});

/**
 * @route   PUT /api/v1/orders/admin/:id/status
 * @desc    Met à jour le statut d'une commande (ADMIN)
 * @access  Private/Admin
 */
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNote } = req.body;

  if (!status) {
    res.status(400).json({
      success: false,
      message: 'Statut requis',
    });
    return;
  }

  const order = await updateOrderStatus(id, status as OrderStatus, adminNote);

  res.status(200).json({
    success: true,
    message: 'Statut de commande mis à jour',
    data: { order },
  });
});

/**
 * @route   PUT /api/v1/orders/admin/:id/payment
 * @desc    Met à jour le statut de paiement (ADMIN)
 * @access  Private/Admin
 */
export const updatePayment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentStatus, transactionId } = req.body;

  if (!paymentStatus) {
    res.status(400).json({
      success: false,
      message: 'Statut de paiement requis',
    });
    return;
  }

  const order = await updatePaymentStatus(
    id,
    paymentStatus as PaymentStatus,
    transactionId
  );

  res.status(200).json({
    success: true,
    message: 'Statut de paiement mis à jour',
    data: { order },
  });
});

/**
 * @route   GET /api/v1/orders/admin/stats
 * @desc    Récupère les statistiques des commandes (ADMIN)
 * @access  Private/Admin
 */
export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getOrderStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});
