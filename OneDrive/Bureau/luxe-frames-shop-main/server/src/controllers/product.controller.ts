import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service';

/**
 * @route   GET /api/v1/products
 * @desc    Récupère tous les produits avec filtres
 * @access  Public
 */
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    category,
    gender,
    minPrice,
    maxPrice,
    search,
    isFeatured,
    page,
    limit,
    sortBy,
    sortOrder,
  } = req.query;

  const filters = {
    category: category as string,
    gender: gender as string,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    search: search as string,
    isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
  };

  const pagination = {
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    sortBy: sortBy as 'createdAt' | 'price' | 'name' | undefined,
    sortOrder: sortOrder as 'asc' | 'desc' | undefined,
  };

  const result = await getProducts(filters, pagination);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @route   GET /api/v1/products/featured
 * @desc    Récupère les produits mis en avant
 * @access  Public
 */
export const getFeatured = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
  const products = await getFeaturedProducts(limit);

  res.status(200).json({
    success: true,
    data: { products },
  });
});

/**
 * @route   GET /api/v1/products/:id
 * @desc    Récupère un produit par ID
 * @access  Public
 */
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await getProductById(id);

  if (!product) {
    res.status(404).json({
      success: false,
      message: 'Produit non trouvé',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { product },
  });
});

/**
 * @route   GET /api/v1/products/slug/:slug
 * @desc    Récupère un produit par slug
 * @access  Public
 */
export const getProductBySlugController = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    const product = await getProductBySlug(slug);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Produit non trouvé',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  }
);

/**
 * @route   GET /api/v1/products/:id/similar
 * @desc    Récupère les produits similaires
 * @access  Public
 */
export const getSimilar = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;

  const products = await getSimilarProducts(id, limit);

  res.status(200).json({
    success: true,
    data: { products },
  });
});

/**
 * @route   POST /api/v1/products
 * @desc    Crée un nouveau produit
 * @access  Private/Admin
 */
export const create = asyncHandler(async (req: Request, res: Response) => {
  const product = await createProduct(req.body);

  res.status(201).json({
    success: true,
    message: 'Produit créé avec succès',
    data: { product },
  });
});

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Met à jour un produit
 * @access  Private/Admin
 */
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await updateProduct(id, req.body);

  res.status(200).json({
    success: true,
    message: 'Produit mis à jour avec succès',
    data: { product },
  });
});

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Supprime un produit (soft delete)
 * @access  Private/Admin
 */
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await deleteProduct(id);

  res.status(200).json({
    success: true,
    message: 'Produit supprimé avec succès',
  });
});
