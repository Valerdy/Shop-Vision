import { Router } from 'express';
import { getAll, get, create, update, remove, setDefault } from '../controllers/address.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate); // Toutes les routes nécessitent authentification

router.get('/', getAll);
router.get('/:id', get);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.put('/:id/default', setDefault);

export default router;
