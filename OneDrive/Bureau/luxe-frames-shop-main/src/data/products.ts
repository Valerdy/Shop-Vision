export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images: string[];
  category: 'optical' | 'sunglasses';
  gender: 'men' | 'women' | 'unisex';
  description: string;
  features: string[];
  frameShape: string;
  material: string;
  color: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Round',
    brand: 'LuxVision',
    price: 95000,
    image: '/placeholder.svg?height=400&width=400&text=Classic+Round',
    images: [
      '/placeholder.svg?height=600&width=600&text=Classic+Round+1',
      '/placeholder.svg?height=600&width=600&text=Classic+Round+2',
      '/placeholder.svg?height=600&width=600&text=Classic+Round+3',
    ],
    category: 'optical',
    gender: 'unisex',
    description: 'Timeless round frames that blend vintage charm with modern sophistication.',
    features: ['Lightweight acetate', 'Spring hinges', 'Anti-reflective coating', 'UV protection'],
    frameShape: 'Round',
    material: 'Acetate',
    color: 'Tortoise',
  },
  {
    id: '2',
    name: 'Aviator Pro',
    brand: 'SkyLine',
    price: 125000,
    image: '/placeholder.svg?height=400&width=400&text=Aviator+Pro',
    images: [
      '/placeholder.svg?height=600&width=600&text=Aviator+Pro+1',
      '/placeholder.svg?height=600&width=600&text=Aviator+Pro+2',
      '/placeholder.svg?height=600&width=600&text=Aviator+Pro+3',
    ],
    category: 'sunglasses',
    gender: 'unisex',
    description: 'Iconic aviator sunglasses with premium polarized lenses for ultimate eye protection.',
    features: ['Polarized lenses', 'Metal frame', '100% UV protection', 'Adjustable nose pads'],
    frameShape: 'Aviator',
    material: 'Metal',
    color: 'Gold',
  },
  {
    id: '3',
    name: 'Cat Eye Elegance',
    brand: 'Femme',
    price: 105000,
    image: '/placeholder.svg?height=400&width=400&text=Cat+Eye',
    images: [
      '/placeholder.svg?height=600&width=600&text=Cat+Eye+1',
      '/placeholder.svg?height=600&width=600&text=Cat+Eye+2',
      '/placeholder.svg?height=600&width=600&text=Cat+Eye+3',
    ],
    category: 'optical',
    gender: 'women',
    description: 'Sophisticated cat-eye frames that add a touch of glamour to any look.',
    features: ['Handcrafted acetate', 'Flexible temples', 'Scratch-resistant', 'Blue light filtering'],
    frameShape: 'Cat Eye',
    material: 'Acetate',
    color: 'Black',
  },
  {
    id: '4',
    name: 'Urban Square',
    brand: 'ModernEdge',
    price: 85000,
    image: '/placeholder.svg?height=400&width=400&text=Urban+Square',
    images: [
      '/placeholder.svg?height=600&width=600&text=Urban+Square+1',
      '/placeholder.svg?height=600&width=600&text=Urban+Square+2',
      '/placeholder.svg?height=600&width=600&text=Urban+Square+3',
    ],
    category: 'optical',
    gender: 'men',
    description: 'Contemporary square frames perfect for the modern professional.',
    features: ['Titanium frame', 'Adjustable fit', 'Anti-glare coating', 'Lightweight design'],
    frameShape: 'Square',
    material: 'Titanium',
    color: 'Matte Black',
  },
  {
    id: '5',
    name: 'Retro Wayfarer',
    brand: 'Vintage Soul',
    price: 90000,
    image: '/placeholder.svg?height=400&width=400&text=Retro+Wayfarer',
    images: [
      '/placeholder.svg?height=600&width=600&text=Retro+Wayfarer+1',
      '/placeholder.svg?height=600&width=600&text=Retro+Wayfarer+2',
      '/placeholder.svg?height=600&width=600&text=Retro+Wayfarer+3',
    ],
    category: 'sunglasses',
    gender: 'unisex',
    description: 'Classic wayfarer style with a modern twist for the trendsetter.',
    features: ['Polarized lenses', 'Acetate frame', 'UV400 protection', 'Iconic design'],
    frameShape: 'Wayfarer',
    material: 'Acetate',
    color: 'Tortoise Brown',
  },
  {
    id: '6',
    name: 'Sport Shield',
    brand: 'ActiveVision',
    price: 115000,
    image: '/placeholder.svg?height=400&width=400&text=Sport+Shield',
    images: [
      '/placeholder.svg?height=600&width=600&text=Sport+Shield+1',
      '/placeholder.svg?height=600&width=600&text=Sport+Shield+2',
      '/placeholder.svg?height=600&width=600&text=Sport+Shield+3',
    ],
    category: 'sunglasses',
    gender: 'unisex',
    description: 'High-performance sports sunglasses designed for active lifestyles.',
    features: ['Impact-resistant', 'Wraparound design', 'Anti-fog coating', 'Rubberized grip'],
    frameShape: 'Shield',
    material: 'TR90',
    color: 'Matte Grey',
  },
  {
    id: '7',
    name: 'Oversized Glam',
    brand: 'Diva',
    price: 110000,
    image: '/placeholder.svg?height=400&width=400&text=Oversized+Glam',
    images: [
      '/placeholder.svg?height=600&width=600&text=Oversized+Glam+1',
      '/placeholder.svg?height=600&width=600&text=Oversized+Glam+2',
      '/placeholder.svg?height=600&width=600&text=Oversized+Glam+3',
    ],
    category: 'sunglasses',
    gender: 'women',
    description: 'Bold oversized sunglasses that make a statement wherever you go.',
    features: ['Gradient lenses', 'Large coverage', 'Metal accents', 'Designer style'],
    frameShape: 'Oversized',
    material: 'Acetate',
    color: 'Burgundy',
  },
  {
    id: '8',
    name: 'Minimalist Wire',
    brand: 'Essence',
    price: 75000,
    image: '/placeholder.svg?height=400&width=400&text=Minimalist+Wire',
    images: [
      '/placeholder.svg?height=600&width=600&text=Minimalist+Wire+1',
      '/placeholder.svg?height=600&width=600&text=Minimalist+Wire+2',
      '/placeholder.svg?height=600&width=600&text=Minimalist+Wire+3',
    ],
    category: 'optical',
    gender: 'unisex',
    description: 'Ultra-lightweight wire frames for those who prefer understated elegance.',
    features: ['Thin wire frame', 'Memory metal', 'Barely-there feel', 'Adjustable nose pads'],
    frameShape: 'Oval',
    material: 'Metal',
    color: 'Silver',
  },
];
