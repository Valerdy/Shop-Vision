import { Router } from 'express';
import { get, add, remove, clear } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // Toutes les routes nécessitent authentification

router.get('/', get);
router.post('/', add);
router.delete('/:productId', remove);
router.delete('/', clear);

export default router;
