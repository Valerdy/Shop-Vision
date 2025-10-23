import { Router } from 'express';
import {
  create,
  getMyOrders,
  getOrder,
  cancel,
  getAll,
  getOrderAdmin,
  updateStatus,
  updatePayment,
  getStats,
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Routes utilisateur (authentification requise)
router.post('/', authenticate, create);
router.get('/', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrder);
router.put('/:id/cancel', authenticate, cancel);

// Routes admin
router.get('/admin/all', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getAll);
router.get('/admin/stats', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getStats);
router.get('/admin/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), getOrderAdmin);
router.put('/admin/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updateStatus);
router.put('/admin/:id/payment', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), updatePayment);

export default router;
