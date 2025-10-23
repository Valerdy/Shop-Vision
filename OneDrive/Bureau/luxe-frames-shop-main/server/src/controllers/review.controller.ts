import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { createReview, getProductReviews, deleteReview } from '../services/review.service';

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { productId, rating, title, comment } = req.body;

  if (!productId || !rating || !comment) {
    res.status(400).json({ success: false, message: 'Données manquantes' });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ success: false, message: 'Note invalide (1-5)' });
    return;
  }

  const review = await createReview(req.userId, productId, rating, title, comment);

  res.status(201).json({
    success: true,
    message: 'Avis ajouté avec succès',
    data: { review },
  });
});

export const getByProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const reviews = await getProductReviews(productId);

  res.status(200).json({
    success: true,
    data: { reviews },
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }

  const { id } = req.params;
  await deleteReview(id, req.userId);

  res.status(200).json({
    success: true,
    message: 'Avis supprimé avec succès',
  });
});
