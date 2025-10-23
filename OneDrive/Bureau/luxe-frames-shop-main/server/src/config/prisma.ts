import { PrismaClient } from '@prisma/client';

// Singleton pattern pour Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Gestion de la déconnexion gracieuse
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
