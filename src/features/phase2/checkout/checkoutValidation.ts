import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
  addressLine1: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  addressLine2: z
    .string()
    .trim()
    .max(200, 'Address line 2 must be less than 200 characters')
    .optional(),
  city: z
    .string()
    .trim()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'City can only contain letters, spaces, hyphens, and apostrophes'),
  state: z
    .string()
    .trim()
    .min(2, 'State/Province is required')
    .max(100, 'State/Province must be less than 100 characters'),
  postalCode: z
    .string()
    .trim()
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code must be less than 20 characters')
    .regex(/^[A-Z0-9\s-]+$/i, 'Invalid postal code format'),
  country: z
    .string()
    .trim()
    .min(2, 'Country is required')
    .max(100, 'Country must be less than 100 characters'),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[0-9+\s()-]+$/, 'Invalid phone number format'),
});

export const paymentDetailsSchema = z.object({
  cardholderName: z
    .string()
    .trim()
    .min(2, 'Cardholder name must be at least 2 characters')
    .max(100, 'Cardholder name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Cardholder name can only contain letters, spaces, hyphens, and apostrophes'),
  cardNumber: z
    .string()
    .trim()
    .regex(/^\d{13,19}$/, 'Card number must be 13-19 digits')
    .transform(val => val.replace(/\s/g, '')),
  expiryDate: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiry date must be in MM/YY format')
    .refine((val) => {
      const [month, year] = val.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      return expiry > new Date();
    }, 'Card has expired'),
  cvc: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits'),
});

export const checkoutFormSchema = z.object({
  shipping: shippingAddressSchema,
  payment: paymentDetailsSchema,
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type PaymentDetailsInput = z.infer<typeof paymentDetailsSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
