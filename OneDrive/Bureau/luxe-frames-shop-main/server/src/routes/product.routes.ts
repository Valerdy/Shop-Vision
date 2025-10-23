import { Router } from 'express';
import {
  getAllProducts,
  getProduct,
  getProductBySlugController,
  getFeatured,
  getSimilar,
  create,
  update,
  remove,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Routes publiques
router.get('/', getAllProducts);
router.get('/featured', getFeatured);
router.get('/slug/:slug', getProductBySlugController);
router.get('/:id', getProduct);
router.get('/:id/similar', getSimilar);

// Routes admin
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), create);
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), update);
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), remove);

export default router;
