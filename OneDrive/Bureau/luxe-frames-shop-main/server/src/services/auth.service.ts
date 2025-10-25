import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { generateTokenPair, verifyRefreshToken, TokenPair, TokenPayload } from './jwt.service';
import { User, UserRole } from '@prisma/client';

// Nombre de rounds pour le hachage bcrypt
const SALT_ROUNDS = 12;

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  tokens: TokenPair;
}

/**
 * Enregistre un nouvel utilisateur
 */
export const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
  const { email, password, firstName, lastName, phone } = input;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error('Un compte existe déjà avec cet email');
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: UserRole.CUSTOMER,
    },
  });

  // Générer les tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Retourner l'utilisateur sans le mot de passe
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    tokens,
  };
};

/**
 * Connecte un utilisateur existant
 */
export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const { email, password } = input;

  // Trouver l'utilisateur
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Générer les tokens
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  // Retourner l'utilisateur sans le mot de passe
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    tokens,
  };
};

/**
 * Rafraîchit l'access token avec un refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenPair> => {
  try {
    // Vérifier le refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Générer une nouvelle paire de tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return tokens;
  } catch (error) {
    throw new Error('Refresh token invalide ou expiré');
  }
};

/**
 * Récupère un utilisateur par son ID
 */
export const getUserById = async (userId: string): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return null;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Met à jour le profil utilisateur
 */
export const updateUserProfile = async (
  userId: string,
  data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>
): Promise<Omit<User, 'password'>> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Change le mot de passe d'un utilisateur
 */
export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  // Récupérer l'utilisateur avec son mot de passe
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  // Vérifier l'ancien mot de passe
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordValid) {
    throw new Error('Ancien mot de passe incorrect');
  }

  // Hacher le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  // Mettre à jour le mot de passe
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};
