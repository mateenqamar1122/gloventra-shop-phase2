export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  inStock: boolean;
  marketplace?: 'Amazon' | 'eBay' | 'AliExpress';
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: CartItem[];
}
