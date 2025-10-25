import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-fallback-refresh-secret';

// Durée de validité des tokens
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 jours

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Génère un access token JWT
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'luxvision-api',
    audience: 'luxvision-client',
  });
};

/**
 * Génère un refresh token JWT
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
    issuer: 'luxvision-api',
    audience: 'luxvision-client',
  });
};

/**
 * Génère une paire de tokens (access + refresh)
 */
export const generateTokenPair = (payload: TokenPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Vérifie et décode un access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'luxvision-api',
      audience: 'luxvision-client',
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expiré');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token invalide');
    }
    throw new Error('Erreur de vérification du token');
  }
};

/**
 * Vérifie et décode un refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET, {
      issuer: 'luxvision-api',
      audience: 'luxvision-client',
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expiré');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Refresh token invalide');
    }
    throw new Error('Erreur de vérification du refresh token');
  }
};

/**
 * Décode un token sans vérification (utile pour débug)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
};
