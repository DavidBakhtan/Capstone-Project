
import { ProductWithStore } from './types';

export const electronicsProducts: ProductWithStore[] = [
  // Best Buy
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 999.99,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip.',
    category: 'Electronics',
    store: 'Best Buy'
  },
  {
    id: '2',
    name: 'Samsung 4K Smart TV',
    price: 599.99,
    originalPrice: 799.99,
    isOnSale: true,
    salePercentage: 25,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop',
    description: '55-inch 4K UHD Smart TV with HDR and streaming apps.',
    category: 'Electronics',
    store: 'Best Buy'
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    price: 1199.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    description: '13-inch MacBook Air with M2 chip, 8GB RAM, 256GB SSD.',
    category: 'Electronics',
    store: 'Best Buy'
  },
  {
    id: '4',
    name: 'Sony WH-1000XM4',
    price: 279.99,
    originalPrice: 349.99,
    isOnSale: true,
    salePercentage: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    description: 'Wireless noise-canceling headphones with 30-hour battery life.',
    category: 'Electronics',
    store: 'Best Buy'
  },
  {
    id: '5',
    name: 'Nintendo Switch OLED',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&h=500&fit=crop',
    description: 'Gaming console with vibrant OLED screen and enhanced audio.',
    category: 'Electronics',
    store: 'Best Buy'
  },
  // Walmart Electronics
  {
    id: '21',
    name: 'HP Laptop',
    price: 449.99,
    originalPrice: 599.99,
    isOnSale: true,
    salePercentage: 25,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
    description: '15.6-inch laptop with Intel Core i5 processor.',
    category: 'Electronics',
    store: 'Walmart'
  },
  {
    id: '22',
    name: 'Bluetooth Speaker',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    description: 'Portable wireless speaker with deep bass.',
    category: 'Electronics',
    store: 'Walmart'
  },
  {
    id: '23',
    name: 'Tablet 10-inch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    description: 'Android tablet with HD display and long battery life.',
    category: 'Electronics',
    store: 'Walmart'
  },
  {
    id: '24',
    name: 'Wireless Earbuds',
    price: 79.99,
    originalPrice: 99.99,
    isOnSale: true,
    salePercentage: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    description: 'True wireless earbuds with charging case.',
    category: 'Electronics',
    store: 'Walmart'
  },
  {
    id: '25',
    name: 'Smart Watch',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    description: 'Fitness tracker with heart rate monitor and GPS.',
    category: 'Electronics',
    store: 'Walmart'
  }
];
