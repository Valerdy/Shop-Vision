import { Router } from 'express';
import {
  register,
  login,
  refresh,
  getMe,
  updateProfile,
  updatePassword,
  logout,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Routes protégées (nécessitent authentification)
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, updatePassword);
router.post('/logout', authenticate, logout);

export default router;
