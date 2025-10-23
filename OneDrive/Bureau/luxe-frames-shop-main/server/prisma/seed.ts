import { PrismaClient, Gender, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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

  // ============================================
  // CREATE PRODUCTS
  // ============================================
  console.log('👓 Creating products...');

  const products = await Promise.all([
    // Optical Products
    prisma.product.create({
      data: {
        name: 'Classic Round',
        slug: 'classic-round',
        brand: 'LuxVision',
        price: 95000,
        description: 'Timeless round frames that blend vintage charm with modern sophistication.',
        categoryId: opticalCategory.id,
        gender: Gender.UNISEX,
        frameShape: 'Round',
        material: 'Acetate',
        color: 'Tortoise',
        stock: 12,
        images: [
          '/placeholder.svg?height=600&width=600&text=Classic+Round+1',
          '/placeholder.svg?height=600&width=600&text=Classic+Round+2',
          '/placeholder.svg?height=600&width=600&text=Classic+Round+3',
        ],
        features: ['Lightweight acetate', 'Spring hinges', 'Anti-reflective coating', 'UV protection'],
        isFeatured: true,
      },
    }),

    prisma.product.create({
      data: {
        name: 'Cat Eye Elegance',
        slug: 'cat-eye-elegance',
        brand: 'Femme',
        price: 105000,
        description: 'Sophisticated cat-eye frames that add a touch of glamour to any look.',
        categoryId: opticalCategory.id,
        gender: Gender.WOMEN,
        frameShape: 'Cat Eye',
        material: 'Acetate',
        color: 'Black',
        stock: 15,
        images: [
          '/placeholder.svg?height=600&width=600&text=Cat+Eye+1',
          '/placeholder.svg?height=600&width=600&text=Cat+Eye+2',
          '/placeholder.svg?height=600&width=600&text=Cat+Eye+3',
        ],
        features: ['Handcrafted acetate', 'Flexible temples', 'Scratch-resistant', 'Blue light filtering'],
        isFeatured: true,
      },
    }),

    prisma.product.create({
      data: {
        name: 'Urban Square',
        slug: 'urban-square',
        brand: 'ModernEdge',
        price: 85000,
        description: 'Contemporary square frames perfect for the modern professional.',
        categoryId: opticalCategory.id,
        gender: Gender.MEN,
        frameShape: 'Square',
        material: 'Titanium',
        color: 'Matte Black',
        stock: 20,
        images: [
          '/placeholder.svg?height=600&width=600&text=Urban+Square+1',
          '/placeholder.svg?height=600&width=600&text=Urban+Square+2',
          '/placeholder.svg?height=600&width=600&text=Urban+Square+3',
        ],
        features: ['Titanium frame', 'Adjustable fit', 'Anti-glare coating', 'Lightweight design'],
      },
    }),

    prisma.product.create({
      data: {
        name: 'Minimalist Wire',
        slug: 'minimalist-wire',
        brand: 'Essence',
        price: 75000,
        description: 'Ultra-lightweight wire frames for those who prefer understated elegance.',
        categoryId: opticalCategory.id,
        gender: Gender.UNISEX,
        frameShape: 'Oval',
        material: 'Metal',
        color: 'Silver',
        stock: 25,
        images: [
          '/placeholder.svg?height=600&width=600&text=Minimalist+Wire+1',
          '/placeholder.svg?height=600&width=600&text=Minimalist+Wire+2',
          '/placeholder.svg?height=600&width=600&text=Minimalist+Wire+3',
        ],
        features: ['Thin wire frame', 'Memory metal', 'Barely-there feel', 'Adjustable nose pads'],
      },
    }),

    // Sunglasses Products
    prisma.product.create({
      data: {
        name: 'Aviator Pro',
        slug: 'aviator-pro',
        brand: 'SkyLine',
        price: 125000,
        description: 'Iconic aviator sunglasses with premium polarized lenses for ultimate eye protection.',
        categoryId: sunglassesCategory.id,
        gender: Gender.UNISEX,
        frameShape: 'Aviator',
        material: 'Metal',
        color: 'Gold',
        stock: 8,
        images: [
          '/placeholder.svg?height=600&width=600&text=Aviator+Pro+1',
          '/placeholder.svg?height=600&width=600&text=Aviator+Pro+2',
          '/placeholder.svg?height=600&width=600&text=Aviator+Pro+3',
        ],
        features: ['Polarized lenses', 'Metal frame', '100% UV protection', 'Adjustable nose pads'],
        isFeatured: true,
      },
    }),

    prisma.product.create({
      data: {
        name: 'Retro Wayfarer',
        slug: 'retro-wayfarer',
        brand: 'Vintage Soul',
        price: 90000,
        description: 'Classic wayfarer style with a modern twist for the trendsetter.',
        categoryId: sunglassesCategory.id,
        gender: Gender.UNISEX,
        frameShape: 'Wayfarer',
        material: 'Acetate',
        color: 'Tortoise Brown',
        stock: 5,
        images: [
          '/placeholder.svg?height=600&width=600&text=Retro+Wayfarer+1',
          '/placeholder.svg?height=600&width=600&text=Retro+Wayfarer+2',
          '/placeholder.svg?height=600&width=600&text=Retro+Wayfarer+3',
        ],
        features: ['Polarized lenses', 'Acetate frame', 'UV400 protection', 'Iconic design'],
        isFeatured: true,
      },
    }),

    prisma.product.create({
      data: {
        name: 'Sport Shield',
        slug: 'sport-shield',
        brand: 'ActiveVision',
        price: 115000,
        description: 'High-performance sports sunglasses designed for active lifestyles.',
        categoryId: sunglassesCategory.id,
        gender: Gender.UNISEX,
        frameShape: 'Shield',
        material: 'TR90',
        color: 'Matte Grey',
        stock: 18,
        images: [
          '/placeholder.svg?height=600&width=600&text=Sport+Shield+1',
          '/placeholder.svg?height=600&width=600&text=Sport+Shield+2',
          '/placeholder.svg?height=600&width=600&text=Sport+Shield+3',
        ],
        features: ['Impact-resistant', 'Wraparound design', 'Anti-fog coating', 'Rubberized grip'],
      },
    }),

    prisma.product.create({
      data: {
        name: 'Oversized Glam',
        slug: 'oversized-glam',
        brand: 'Diva',
        price: 110000,
        description: 'Bold oversized sunglasses that make a statement wherever you go.',
        categoryId: sunglassesCategory.id,
        gender: Gender.WOMEN,
        frameShape: 'Oversized',
        material: 'Acetate',
        color: 'Burgundy',
        stock: 10,
        images: [
          '/placeholder.svg?height=600&width=600&text=Oversized+Glam+1',
          '/placeholder.svg?height=600&width=600&text=Oversized+Glam+2',
          '/placeholder.svg?height=600&width=600&text=Oversized+Glam+3',
        ],
        features: ['Gradient lenses', 'Large coverage', 'Metal accents', 'Designer style'],
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

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

  await Promise.all([
    prisma.review.create({
      data: {
        productId: products[0].id, // Classic Round
        userId: demoUser.id,
        rating: 5,
        title: 'Excellente qualité !',
        comment: 'Les montures sont élégantes et très confortables. Je les porte tous les jours sans aucun problème.',
        verified: true,
      },
    }),

    prisma.review.create({
      data: {
        productId: products[4].id, // Aviator Pro
        userId: demoUser.id,
        rating: 5,
        title: 'Parfaites pour l\'été',
        comment: 'Les meilleures lunettes de soleil que j\'ai jamais eues ! Les verres polarisés sont incroyables.',
        verified: true,
      },
    }),
  ]);

  console.log('✅ Created reviews');

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
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
