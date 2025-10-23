import { prisma } from '../config/prisma';

export const createReview = async (
  userId: string,
  productId: string,
  rating: number,
  title: string | undefined,
  comment: string,
  verified: boolean = false
) => {
  // Vérifier si l'utilisateur a déjà laissé un avis
  const existing = await prisma.review.findUnique({
    where: {
      productId_userId: {
        productId,
        userId,
      },
    },
  });

  if (existing) {
    throw new Error('Vous avez déjà laissé un avis pour ce produit');
  }

  return await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      title,
      comment,
      verified,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const getProductReviews = async (productId: string) => {
  return await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const deleteReview = async (reviewId: string, userId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error('Avis introuvable');
  }

  if (review.userId !== userId) {
    throw new Error('Non autorisé');
  }

  return await prisma.review.delete({
    where: { id: reviewId },
  });
};
