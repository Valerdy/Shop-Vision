import { Router } from 'express';
import { create, getByProduct, remove } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, create);
router.get('/product/:productId', getByProduct);
router.delete('/:id', authenticate, remove);

export default router;
