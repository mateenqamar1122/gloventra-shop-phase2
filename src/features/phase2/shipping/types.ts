export interface ShippingOption {
  id: string;
  carrier: 'DHL' | 'FedEx' | 'Aramex' | 'UPS';
  serviceName: string;
  rate: number;
  currency: string;
  estimatedDays: number;
  estimatedDeliveryDate: string;
  trackingAvailable: boolean;
}

export interface ShippingRateRequest {
  destinationCountry: string;
  destinationCity: string;
  destinationPostalCode: string;
  weight: number; // in kg
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed';
  estimatedDelivery?: string;
  currentLocation?: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  shippingMethod?: {
    carrier: string;
    serviceName: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}
