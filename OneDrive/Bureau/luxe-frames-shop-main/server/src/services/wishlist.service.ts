import { prisma } from '../config/prisma';

export const getWishlist = async (userId: string) => {
  return await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true,
          reviews: {
            select: { rating: true },
          },
        },
      },
    },
    orderBy: {
      addedAt: 'desc',
    },
  });
};

export const addToWishlist = async (userId: string, productId: string) => {
  // Vérifier si déjà dans la wishlist
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return await prisma.wishlist.create({
    data: {
      userId,
      productId,
    },
    include: {
      product: true,
    },
  });
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  return await prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

export const clearWishlist = async (userId: string) => {
  return await prisma.wishlist.deleteMany({
    where: { userId },
  });
};
