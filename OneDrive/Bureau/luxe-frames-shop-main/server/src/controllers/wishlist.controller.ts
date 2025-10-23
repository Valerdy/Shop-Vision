import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } from '../services/wishlist.service';

export const get = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const wishlist = await getWishlist(req.userId);

  res.status(200).json({
    success: true,
    data: { wishlist },
  });
});

export const add = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { productId } = req.body;

  if (!productId) {
    res.status(400).json({ success: false, message: 'ProductId requis' });
    return;
  }

  const item = await addToWishlist(req.userId, productId);

  res.status(200).json({
    success: true,
    message: 'Produit ajouté à la liste de souhaits',
    data: { item },
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { productId } = req.params;
  await removeFromWishlist(req.userId, productId);

  res.status(200).json({
    success: true,
    message: 'Produit retiré de la liste de souhaits',
  });
});

export const clear = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  await clearWishlist(req.userId);

  res.status(200).json({
    success: true,
    message: 'Liste de souhaits vidée',
  });
});
