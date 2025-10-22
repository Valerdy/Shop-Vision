export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export const reviews: Review[] = [
  // Classic Round (product 1)
  {
    id: 'r1',
    productId: '1',
    author: 'Marie K.',
    rating: 5,
    date: '2025-01-15',
    comment: 'Excellente qualité ! Les montures sont élégantes et très confortables. Je les porte tous les jours sans aucun problème.',
    verified: true,
  },
  {
    id: 'r2',
    productId: '1',
    author: 'Jean-Pierre M.',
    rating: 4,
    date: '2025-01-10',
    comment: 'Très bon produit, design classique et intemporel. Légèrement cher mais la qualité est au rendez-vous.',
    verified: true,
  },
  {
    id: 'r3',
    productId: '1',
    author: 'Sophie L.',
    rating: 5,
    date: '2024-12-28',
    comment: 'Parfait pour mon visage rond ! Le style vintage me va à merveille. Livraison rapide en plus.',
    verified: false,
  },

  // Aviator Pro (product 2)
  {
    id: 'r4',
    productId: '2',
    author: 'Alain D.',
    rating: 5,
    date: '2025-01-18',
    comment: 'Les meilleures lunettes de soleil que j\'ai jamais eues ! Les verres polarisés sont incroyables, plus d\'éblouissement.',
    verified: true,
  },
  {
    id: 'r5',
    productId: '2',
    author: 'Fatou S.',
    rating: 5,
    date: '2025-01-12',
    comment: 'Superbe qualité, monture solide et élégante. Parfaites pour conduire sous le soleil de Pointe-Noire !',
    verified: true,
  },
  {
    id: 'r6',
    productId: '2',
    author: 'Patrick N.',
    rating: 4,
    date: '2025-01-05',
    comment: 'Très satisfait, le style aviateur est indémodable. Petit bémol sur le prix mais ça vaut le coup.',
    verified: true,
  },

  // Cat Eye Elegance (product 3)
  {
    id: 'r7',
    productId: '3',
    author: 'Delphine B.',
    rating: 5,
    date: '2025-01-16',
    comment: 'Magnifiques ! Ces lunettes cat eye ajoutent une touche glamour à n\'importe quelle tenue. Je suis ravie !',
    verified: true,
  },
  {
    id: 'r8',
    productId: '3',
    author: 'Clarisse M.',
    rating: 4,
    date: '2025-01-08',
    comment: 'Très jolies et bien finies. Le filtre lumière bleue est un vrai plus pour mes longues journées devant l\'ordinateur.',
    verified: true,
  },

  // Urban Square (product 4)
  {
    id: 'r9',
    productId: '4',
    author: 'Thomas R.',
    rating: 5,
    date: '2025-01-14',
    comment: 'Parfaites pour le bureau ! Design moderne et discret, titane ultra-léger. Vraiment confortables.',
    verified: true,
  },
  {
    id: 'r10',
    productId: '4',
    author: 'Emmanuel K.',
    rating: 5,
    date: '2025-01-06',
    comment: 'Excellente qualité de fabrication. Les charnières sont solides et la forme carrée me va parfaitement.',
    verified: true,
  },

  // Retro Wayfarer (product 5)
  {
    id: 'r11',
    productId: '5',
    author: 'Marina P.',
    rating: 5,
    date: '2025-01-17',
    comment: 'Le style rétro parfait ! Portées en toute occasion, ces lunettes attirent toujours les compliments.',
    verified: true,
  },
  {
    id: 'r12',
    productId: '5',
    author: 'David L.',
    rating: 5,
    date: '2025-01-11',
    comment: 'Excellent rapport qualité-prix ! Les verres polarisés sont top et le design est intemporel.',
    verified: true,
  },

  // Sport Shield (product 6)
  {
    id: 'r13',
    productId: '6',
    author: 'Yannick T.',
    rating: 4,
    date: '2025-01-13',
    comment: 'Très bonnes pour le sport ! Tiennent bien en place pendant la course. Juste un peu lourdes.',
    verified: true,
  },
  {
    id: 'r14',
    productId: '6',
    author: 'Christian B.',
    rating: 5,
    date: '2025-01-07',
    comment: 'Parfaites pour le vélo et la course à pied. Anti-buée efficace et protection UV excellente.',
    verified: true,
  },

  // Oversized Glam (product 7)
  {
    id: 'r15',
    productId: '7',
    author: 'Nathalie F.',
    rating: 4,
    date: '2025-01-09',
    comment: 'Super stylées ! J\'adore le look oversized et les verres dégradés. Un peu grandes mais c\'est le style recherché.',
    verified: true,
  },

  // Minimalist Wire (product 8)
  {
    id: 'r16',
    productId: '8',
    author: 'Laurent S.',
    rating: 5,
    date: '2025-01-15',
    comment: 'Parfaites pour quelqu\'un qui n\'aime pas les montures imposantes. Très discrètes et légères, on les oublie !',
    verified: true,
  },
  {
    id: 'r17',
    productId: '8',
    author: 'Isabelle D.',
    rating: 4,
    date: '2025-01-04',
    comment: 'Design minimaliste élégant. Très confortables pour toute la journée. Excellent choix !',
    verified: true,
  },
];
