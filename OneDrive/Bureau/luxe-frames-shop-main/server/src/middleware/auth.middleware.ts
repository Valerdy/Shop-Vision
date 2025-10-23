import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/jwt.service';
import { getUserById } from '../services/auth.service';
import { UserRole } from '@prisma/client';

/**
 * Middleware pour authentifier les requêtes avec JWT
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant',
      });
      return;
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier le token
    const payload = verifyAccessToken(token);

    // Récupérer l'utilisateur
    const user = await getUserById(payload.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé',
      });
      return;
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Token invalide',
    });
  }
};

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Non authentifié',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Accès refusé - Permissions insuffisantes',
      });
      return;
    }

    next();
  };
};

/**
 * Middleware optionnel : authentifie si un token est présent, sinon continue
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);
      const user = await getUserById(payload.userId);

      if (user) {
        req.user = user;
        req.userId = user.id;
      }
    }
  } catch {
    // Ignorer les erreurs pour l'auth optionnelle
  }

  next();
};
