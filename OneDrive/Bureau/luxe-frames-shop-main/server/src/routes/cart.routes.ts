import { Router } from 'express';
import { get, add, update, remove, clear } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // Toutes les routes nécessitent authentification

router.get('/', get);
router.post('/', add);
router.put('/:id', update);
router.delete('/:id', remove);
router.delete('/', clear);

export default router;
