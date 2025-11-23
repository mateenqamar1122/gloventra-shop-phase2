import { Product } from '@/types/product';
import headphones from '@/assets/product-headphones.jpg';
import watch from '@/assets/product-watch.jpg';
import backpack from '@/assets/product-backpack.jpg';
import sneakers from '@/assets/product-sneakers.jpg';
import tv from '@/assets/product-watch.jpg'; // Assuming watch image can be used for TV for now
import laptop from '@/assets/product-sneakers.jpg'; // Assuming sneakers image can be used for laptop for now
import speaker from '@/assets/product-headphones.jpg'; // Assuming headphones image can be used for speaker for now

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones with 30-hour battery life',
    price: 299.99,
    image: headphones,
    category: 'Electronics',
    rating: 4.8,
    inStock: true,
    marketplace: 'Amazon',
    stock: 15,
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness with advanced sensors',
    price: 249.99,
    image: watch,
    category: 'Electronics',
    rating: 4.6,
    inStock: true,
    marketplace: 'eBay',
    stock: 5,
  },
  {
    id: 3,
    name: 'Leather Travel Backpack',
    description: 'Premium leather backpack with laptop compartment',
    price: 179.99,
    image: backpack,
    category: 'Fashion',
    rating: 4.9,
    inStock: true,
    marketplace: 'AliExpress',
    stock: 30,
  },
  {
    id: 4,
    name: 'Modern Sport Sneakers',
    description: ' Lightweight and comfortable athletic shoes',
    price: 129.99,
    image: sneakers,
    category: 'Fashion',
    rating: 4.7,
    inStock: true,
  },
  {
    id: 5,
    name: 'Wireless Earbuds Pro',
    description: 'True wireless earbuds with active noise cancellation',
    price: 199.99,
    image: headphones,
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
  },
  {
    id: 6,
    name: 'Classic Leather Wallet',
    description: 'Handcrafted genuine leather bifold wallet',
    price: 79.99,
    image: backpack,
    category: 'Fashion',
    rating: 4.8,
    inStock: false,
  },
  {
    id: 7,
    name: '4K Smart TV',
    description: '55-inch 4K UHD Smart TV with HDR and voice control',
    price: 799.99,
    image: watch, // Reusing watch image for now, ideally would have a TV image
    category: 'Electronics',
    rating: 4.7,
    inStock: true,
  },
  {
    id: 8,
    name: 'Gaming Laptop',
    description: 'High-performance gaming laptop with RTX graphics and 144Hz display',
    price: 1499.99,
    image: sneakers, // Reusing sneakers image for now, ideally would have a laptop image
    category: 'Electronics',
    rating: 4.9,
    inStock: true,
    marketplace: 'AliExpress',
    stock: 30,
  },
  {
    id: 9,
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof and durable speaker with 12 hours of playtime',
    price: 89.99,
    image: headphones, // Reusing headphones image for now, ideally would have a speaker image
    category: 'Electronics',
    rating: 4.5,
    inStock: true,
  },
];
