
import { Product } from '@/contexts/CartContext';

export interface ProductWithStore extends Product {
  store: string;
  originalPrice?: number;
  isOnSale?: boolean;
  salePercentage?: number;
}
