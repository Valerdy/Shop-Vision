import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../services/cart.service';

export const get = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const cart = await getCart(req.userId);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

export const add = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400).json({ success: false, message: 'ProductId requis' });
    return;
  }

  const item = await addToCart(req.userId, productId, quantity);

  res.status(200).json({
    success: true,
    message: 'Produit ajouté au panier',
    data: { item },
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { id } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400).json({ success: false, message: 'Quantité invalide' });
    return;
  }

  const item = await updateCartItem(id, req.userId, quantity);

  res.status(200).json({
    success: true,
    message: 'Panier mis à jour',
    data: { item },
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { id } = req.params;
  await removeFromCart(id, req.userId);

  res.status(200).json({
    success: true,
    message: 'Produit retiré du panier',
  });
});

export const clear = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  await clearCart(req.userId);

  res.status(200).json({
    success: true,
    message: 'Panier vidé',
  });
});
