import { z } from 'zod';

// Checkout Form Validation
export const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(8, 'Numéro de téléphone invalide').regex(/^[0-9+\s()-]+$/, 'Numéro de téléphone invalide'),
  address: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  state: z.string().min(2, 'Le département doit contenir au moins 2 caractères'),
  zipCode: z.string().min(3, 'Code postal invalide'),
  cardNumber: z.string().min(16, 'Numéro de carte invalide').regex(/^[0-9\s]+$/, 'Numéro de carte invalide'),
  cardName: z.string().min(3, 'Nom du titulaire invalide'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Format invalide (MM/YY)'),
  cvv: z.string().min(3, 'CVV invalide').max(4, 'CVV invalide').regex(/^[0-9]+$/, 'CVV invalide'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Contact Form Validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Newsletter Form Validation
export const newsletterSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
