import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import des routes
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import reviewRoutes from './routes/review.routes';
import wishlistRoutes from './routes/wishlist.routes';
import cartRoutes from './routes/cart.routes';
import addressRoutes from './routes/address.routes';

// Import des middlewares
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GÉNÉRAUX
// ============================================

// Sécurité avec Helmet
app.use(helmet());

// Configuration CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // URL du frontend Vite
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger HTTP (dev uniquement)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LuxVision API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API v1
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur l\'API LuxVision',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      products: '/api/v1/products',
      orders: '/api/v1/orders',
      reviews: '/api/v1/reviews',
      wishlist: '/api/v1/wishlist',
      cart: '/api/v1/cart',
      addresses: '/api/v1/addresses',
    },
  });
});

// Routes API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/addresses', addressRoutes);

// ============================================
// GESTION DES ERREURS
// ============================================

// Route non trouvée
app.use(notFoundHandler);

// Gestionnaire global d'erreurs
app.use(errorHandler);

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log('\n🚀 LuxVision API Server');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📡 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api/v1`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Démarrer le serveur
startServer();

export default app;
