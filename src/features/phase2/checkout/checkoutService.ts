import { api } from '@/lib/api';
import { CartItem } from '@/types/product';

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface CheckoutCalculation {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

// Calculate checkout totals including tax and shipping
export const calculateCheckoutTotals = async (
  items: CartItem[],
  currency: string,
  shippingAddress?: ShippingAddress
): Promise<CheckoutCalculation> => {
  try {
    const response = await api.post('/checkout/calculate', {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      currency,
      shippingAddress,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to calculate checkout totals:', error);
    
    // Fallback calculation
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const taxRate = 0.1; // 10% tax
    const tax = subtotal * taxRate;
    
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      currency,
    };
  }
};

// Validate shipping address with backend
export const validateShippingAddress = async (
  address: ShippingAddress
): Promise<{ valid: boolean; message?: string; suggestedAddress?: ShippingAddress }> => {
  try {
    const response = await api.post('/checkout/validate-address', address);
    return response.data;
  } catch (error) {
    console.error('Failed to validate address:', error);
    // Basic client-side validation fallback
    return { valid: true };
  }
};

// Create payment intent with Stripe/PayPal
export const createPaymentIntent = async (
  amount: number,
  currency: string,
  paymentMethod: 'stripe' | 'paypal',
  items: CartItem[],
  shippingAddress: ShippingAddress
): Promise<PaymentIntent> => {
  try {
    const response = await api.post('/checkout/create-payment', {
      amount,
      currency,
      paymentMethod,
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create payment intent:', error);
    throw new Error('Payment processing failed. Please try again.');
  }
};

// Process payment
export const processPayment = async (
  paymentIntentId: string,
  paymentDetails: PaymentDetails
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    const response = await api.post('/checkout/process-payment', {
      paymentIntentId,
      paymentDetails,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to process payment:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Payment failed. Please check your details.',
    };
  }
};

// Get shipping regions and costs
export const getShippingRegions = async (): Promise<{ country: string; shippingCost: number }[]> => {
  try {
    const response = await api.get('/checkout/shipping-regions');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch shipping regions:', error);
    return [];
  }
};
