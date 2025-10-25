import { PrismaClient, Gender, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

// Load shared products data
const productsData = JSON.parse(
  readFileSync(join(__dirname, '../../shared/data/products.json'), 'utf-8')
);

// Helper function to convert string gender to Gender enum
function mapGender(gender: string): Gender {
  switch (gender.toUpperCase()) {
    case 'MEN':
      return Gender.MEN;
    case 'WOMEN':
      return Gender.WOMEN;
    case 'UNISEX':
      return Gender.UNISEX;
    default:
      return Gender.UNISEX;
  }
}

// Helper function to generate slug from product name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================
  // CLEAN DATABASE (optional - be careful!)
  // ============================================
  console.log('🧹 Cleaning database...');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.contact.deleteMany();

  // ============================================
  // CREATE CATEGORIES
  // ============================================
  console.log('📦 Creating categories...');

  const opticalCategory = await prisma.category.create({
    data: {
      name: 'Optical',
      slug: 'optical',
      description: 'Lunettes de vue premium pour un style au quotidien',
      image: '/images/categories/optical.jpg',
    },
  });

  const sunglassesCategory = await prisma.category.create({
    data: {
      name: 'Sunglasses',
      slug: 'sunglasses',
      description: 'Lunettes de soleil élégantes avec protection UV',
      image: '/images/categories/sunglasses.jpg',
    },
  });

  console.log('✅ Created categories');

  // ============================================
  // CREATE PRODUCTS FROM SHARED DATA
  // ============================================
  console.log('👓 Creating products from shared data file...');

  const categoryMap = {
    optical: opticalCategory.id,
    sunglasses: sunglassesCategory.id,
  };

  const products = await Promise.all(
    productsData.map((productData: any) =>
      prisma.product.create({
        data: {
          name: productData.name,
          slug: generateSlug(productData.name),
          brand: productData.brand,
          price: productData.price,
          description: productData.description,
          categoryId: categoryMap[productData.category as 'optical' | 'sunglasses'],
          gender: mapGender(productData.gender),
          frameShape: productData.frameShape,
          material: productData.material,
          color: productData.color,
          stock: productData.stock,
          images: productData.images,
          features: productData.features,
          isFeatured: productData.isFeatured || false,
        },
      })
    )
  );

  console.log(`✅ Created ${products.length} products from shared data`);

  // ============================================
  // CREATE DEMO USERS
  // ============================================
  console.log('👤 Creating demo users...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@luxvision.cg',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'LuxVision',
      phone: '+242 06 123 4567',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: hashedPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '+242 06 987 6543',
      role: UserRole.CUSTOMER,
      emailVerified: true,
    },
  });

  console.log('✅ Created demo users');

  // ============================================
  // CREATE REVIEWS
  // ============================================
  console.log('⭐ Creating reviews...');

  const reviewsToCreate = [];

  // Add reviews for featured products
  const featuredProducts = products.filter((p, index) =>
    productsData[index].isFeatured
  );

  for (let i = 0; i < Math.min(featuredProducts.length, 5); i++) {
    const product = featuredProducts[i];
    const productData = productsData.find((p: any) => generateSlug(p.name) === product.slug);

    if (productData && productData.rating && productData.reviewsCount) {
      reviewsToCreate.push(
        prisma.review.create({
          data: {
            productId: product.id,
            userId: demoUser.id,
            rating: Math.round(productData.rating),
            title: productData.rating >= 4.5 ? 'Excellente qualité !' : 'Très bon produit',
            comment: `Les ${product.name} sont vraiment superbes ! La qualité est au rendez-vous et le design est magnifique. Je recommande vivement !`,
            verified: true,
          },
        })
      );
    }
  }

  if (reviewsToCreate.length > 0) {
    await Promise.all(reviewsToCreate);
    console.log(`✅ Created ${reviewsToCreate.length} reviews`);
  }

  // ============================================
  // CREATE DEMO ADDRESS
  // ============================================
  console.log('📍 Creating demo address...');

  await prisma.address.create({
    data: {
      userId: demoUser.id,
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '+242 06 987 6543',
      address: '123 Avenue de l\'Indépendance',
      city: 'Pointe-Noire',
      state: 'Kouilou',
      zipCode: '00242',
      country: 'Congo',
      isDefault: true,
    },
  });

  console.log('✅ Created demo address');

  console.log('');
  console.log('🎉 Database seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`   - ${await prisma.category.count()} categories`);
  console.log(`   - ${await prisma.product.count()} products`);
  console.log(`   - ${await prisma.user.count()} users`);
  console.log(`   - ${await prisma.review.count()} reviews`);
  console.log(`   - ${await prisma.address.count()} addresses`);
  console.log('');
  console.log('👤 Demo credentials:');
  console.log('   Admin: admin@luxvision.cg / password123');
  console.log('   Customer: client@example.com / password123');
  console.log('');
  console.log('💡 All products from shared/data/products.json have been imported!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
