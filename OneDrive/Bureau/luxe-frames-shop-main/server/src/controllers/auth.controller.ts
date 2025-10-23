import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getUserById,
  updateUserProfile,
  changePassword,
} from '../services/auth.service';

/**
 * @route   POST /api/auth/register
 * @desc    Enregistrer un nouvel utilisateur
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, phone } = req.body;

  // Validation basique
  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({
      success: false,
      message: 'Tous les champs obligatoires doivent être remplis',
    });
    return;
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Format d\'email invalide',
    });
    return;
  }

  // Validation du mot de passe (minimum 6 caractères)
  if (password.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Le mot de passe doit contenir au moins 6 caractères',
    });
    return;
  }

  const result = await registerUser({
    email,
    password,
    firstName,
    lastName,
    phone,
  });

  res.status(201).json({
    success: true,
    message: 'Compte créé avec succès',
    data: result,
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Connecter un utilisateur
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email et mot de passe requis',
    });
    return;
  }

  const result = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: 'Connexion réussie',
    data: result,
  });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Rafraîchir l'access token
 * @access  Public
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({
      success: false,
      message: 'Refresh token requis',
    });
    return;
  }

  const tokens = await refreshAccessToken(refreshToken);

  res.status(200).json({
    success: true,
    message: 'Token rafraîchi avec succès',
    data: { tokens },
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Obtenir le profil de l'utilisateur connecté
 * @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: 'Non authentifié',
    });
    return;
  }

  const user = await getUserById(req.userId);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Mettre à jour le profil utilisateur
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: 'Non authentifié',
    });
    return;
  }

  const { firstName, lastName, phone } = req.body;

  const updatedUser = await updateUserProfile(req.userId, {
    firstName,
    lastName,
    phone,
  });

  res.status(200).json({
    success: true,
    message: 'Profil mis à jour avec succès',
    data: { user: updatedUser },
  });
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Changer le mot de passe
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    res.status(401).json({
      success: false,
      message: 'Non authentifié',
    });
    return;
  }

  const { oldPassword, newPassword } = req.body;

  // Validation
  if (!oldPassword || !newPassword) {
    res.status(400).json({
      success: false,
      message: 'Ancien et nouveau mot de passe requis',
    });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Le nouveau mot de passe doit contenir au moins 6 caractères',
    });
    return;
  }

  await changePassword(req.userId, oldPassword, newPassword);

  res.status(200).json({
    success: true,
    message: 'Mot de passe changé avec succès',
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnecter un utilisateur (côté client principalement)
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Note: Avec JWT, la déconnexion se fait principalement côté client
  // en supprimant les tokens du localStorage/sessionStorage
  // Pour une vraie invalidation, il faudrait implémenter une blacklist Redis

  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie',
  });
});
