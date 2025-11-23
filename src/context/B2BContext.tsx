import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface B2BUser {
  id: number;
  email: string;
  name: string;
  companyName: string;
  taxId: string;
  address: string;
  isB2B: boolean;
}

export interface B2BPricing {
  productId: number;
  b2bPrice: number;
  minQuantity: number;
  maxQuantity?: number;
}

export interface RFQRequest {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  message: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected';
  createdAt: string;
}

interface B2BContextType {
  isB2BUser: boolean;
  b2bUser: B2BUser | null;
  setB2BUser: (user: B2BUser | null) => void;
  getB2BPricing: (productId: number) => B2BPricing | null;
  submitRFQ: (productId: number, quantity: number, message: string) => Promise<void>;
  rfqRequests: RFQRequest[];
}

const B2BContext = createContext<B2BContextType | undefined>(undefined);

// Mock B2B pricing data
const mockB2BPricing: B2BPricing[] = [
  { productId: 1, b2bPrice: 249.99, minQuantity: 10, maxQuantity: 1000 },
  { productId: 2, b2bPrice: 199.99, minQuantity: 5, maxQuantity: 500 },
  { productId: 3, b2bPrice: 149.99, minQuantity: 20, maxQuantity: 2000 },
  { productId: 4, b2bPrice: 99.99, minQuantity: 10, maxQuantity: 1000 },
];

export const B2BProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [b2bUser, setB2BUser] = useState<B2BUser | null>(null);
  const [rfqRequests, setRfqRequests] = useState<RFQRequest[]>([]);

  const isB2BUser = b2bUser?.isB2B || false;

  const getB2BPricing = (productId: number): B2BPricing | null => {
    return mockB2BPricing.find(p => p.productId === productId) || null;
  };

  const submitRFQ = async (productId: number, quantity: number, message: string): Promise<void> => {
    // In production, this would call your Django API
    // Example: await axios.post('/api/b2b/rfq/', { productId, quantity, message });

    const newRFQ: RFQRequest = {
      id: `rfq-${Date.now()}`,
      productId,
      productName: `Product ${productId}`,
      quantity,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setRfqRequests(prev => [...prev, newRFQ]);
  };

  return (
    <B2BContext.Provider
      value={{
        isB2BUser,
        b2bUser,
        setB2BUser,
        getB2BPricing,
        submitRFQ,
        rfqRequests,
      }}
    >
      {children}
    </B2BContext.Provider>
  );
};

export const useB2B = () => {
  const context = useContext(B2BContext);
  if (context === undefined) {
    throw new Error('useB2B must be used within a B2BProvider');
  }
  return context;
};

