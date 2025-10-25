import { prisma } from '../config/prisma';
import { Product, Prisma } from '@prisma/client';

export interface ProductFilters {
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Récupère tous les produits avec filtres et pagination
 */
export const getProducts = async (
  filters: ProductFilters = {},
  pagination: PaginationOptions = {}
) => {
  const {
    category,
    gender,
    minPrice,
    maxPrice,
    search,
    isFeatured,
  } = filters;

  const {
    page = 1,
    limit = 12,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = pagination;

  // Construction des filtres
  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(isFeatured !== undefined && { isFeatured }),
    ...(gender && { gender }),
    ...(category && {
      category: {
        slug: category,
      },
    }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }
      : {}),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  // Pagination
  const skip = (page - 1) * limit;

  // Exécution des requêtes
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.product.count({ where }),
  ]);

  // Calculer la note moyenne pour chaque produit
  const productsWithRating = products.map((product) => {
    const reviews = product.reviews;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return {
      ...product,
      rating: Math.round(averageRating * 10) / 10,
      reviewsCount: reviews.length,
      reviews: undefined, // Retirer les reviews détaillées
    };
  });

  return {
    products: productsWithRating,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Récupère un produit par son ID
 */
export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
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
      },
    },
  });

  if (!product || !product.isActive) {
    return null;
  }

  // Calculer la note moyenne
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  return {
    ...product,
    rating: Math.round(averageRating * 10) / 10,
    reviewsCount: product.reviews.length,
  };
};

/**
 * Récupère un produit par son slug
 */
export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
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
      },
    },
  });

  if (!product || !product.isActive) {
    return null;
  }

  // Calculer la note moyenne
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  return {
    ...product,
    rating: Math.round(averageRating * 10) / 10,
    reviewsCount: product.reviews.length,
  };
};

/**
 * Récupère les produits mis en avant
 */
export const getFeaturedProducts = async (limit = 8) => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Calculer la note moyenne pour chaque produit
  return products.map((product) => {
    const reviews = product.reviews;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return {
      ...product,
      rating: Math.round(averageRating * 10) / 10,
      reviewsCount: reviews.length,
      reviews: undefined,
    };
  });
};

/**
 * Récupère les produits similaires
 */
export const getSimilarProducts = async (
  productId: string,
  limit = 4
): Promise<any[]> => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryId: true, gender: true },
  });

  if (!product) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      OR: [
        { categoryId: product.categoryId },
        { gender: product.gender },
      ],
    },
    include: {
      category: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    take: limit,
  });

  return products.map((p) => {
    const reviews = p.reviews;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return {
      ...p,
      rating: Math.round(averageRating * 10) / 10,
      reviewsCount: reviews.length,
      reviews: undefined,
    };
  });
};

/**
 * Crée un nouveau produit (ADMIN)
 */
export const createProduct = async (data: Prisma.ProductCreateInput) => {
  return await prisma.product.create({
    data,
    include: {
      category: true,
    },
  });
};

/**
 * Met à jour un produit (ADMIN)
 */
export const updateProduct = async (
  id: string,
  data: Prisma.ProductUpdateInput
) => {
  return await prisma.product.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

/**
 * Supprime un produit (soft delete - ADMIN)
 */
export const deleteProduct = async (id: string) => {
  return await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
};

/**
 * Met à jour le stock d'un produit
 */
export const updateStock = async (id: string, quantity: number) => {
  return await prisma.product.update({
    where: { id },
    data: {
      stock: {
        decrement: quantity,
      },
    },
  });
};
