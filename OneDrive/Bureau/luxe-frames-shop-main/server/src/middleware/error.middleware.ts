import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Interface pour les erreurs personnalisées
 */
interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Middleware de gestion globale des erreurs
 */
export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Erreur de validation Prisma
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: 'Données invalides',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
    return;
  }

  // Erreur de contrainte unique Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Cette ressource existe déjà',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
      return;
    }

    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Ressource non trouvée',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
      return;
    }
  }

  // Erreur avec status code personnalisé
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Une erreur interne est survenue';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

/**
 * Middleware pour les routes non trouvées
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} non trouvée`,
  });
};

/**
 * Wrapper pour les fonctions async afin de capturer les erreurs
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
