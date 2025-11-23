import { api } from '@/lib/api';
import { ShippingOption, ShippingRateRequest, TrackingInfo, Order } from './types';

export type { ShippingOption, ShippingRateRequest, TrackingInfo, Order };

// Get real-time shipping rates from multiple carriers
export const getShippingRates = async (
  request: ShippingRateRequest,
  currency: string
): Promise<ShippingOption[]> => {
  try {
    const response = await api.post('/shipping/rates', {
      ...request,
      currency,
    });
    return response.data.shippingOptions || [];
  } catch (error) {
    console.error('Failed to fetch shipping rates:', error);
    // Fallback mock data for development
    return [
      {
        id: 'dhl-express',
        carrier: 'DHL',
        serviceName: 'DHL Express Worldwide',
        rate: 25.00,
        currency,
        estimatedDays: 3,
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        trackingAvailable: true,
      },
      {
        id: 'fedex-international',
        carrier: 'FedEx',
        serviceName: 'FedEx International Priority',
        rate: 22.50,
        currency,
        estimatedDays: 4,
        estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        trackingAvailable: true,
      },
      {
        id: 'aramex-standard',
        carrier: 'Aramex',
        serviceName: 'Aramex Standard',
        rate: 18.00,
        currency,
        estimatedDays: 5,
        estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        trackingAvailable: true,
      },
      {
        id: 'ups-worldwide',
        carrier: 'UPS',
        serviceName: 'UPS Worldwide Express',
        rate: 24.00,
        currency,
        estimatedDays: 3,
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        trackingAvailable: true,
      },
    ];
  }
};

// Get tracking information for an order
export const getTrackingInfo = async (
  trackingNumber: string,
  carrier: string
): Promise<TrackingInfo> => {
  try {
    const response = await api.get('/shipping/track', {
      params: { trackingNumber, carrier },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch tracking info:', error);
    throw new Error('Unable to retrieve tracking information');
  }
};

// Get user's orders
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data.orders || [];
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    return [];
  }
};

// Get specific order details
export const getOrderDetails = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    throw new Error('Unable to retrieve order details');
  }
};

// Calculate shipping weight from cart items
export const calculateShippingWeight = (items: Array<{ quantity: number }>): number => {
  // Assume average weight of 0.5kg per item
  return items.reduce((total, item) => total + (item.quantity * 0.5), 0);
};
