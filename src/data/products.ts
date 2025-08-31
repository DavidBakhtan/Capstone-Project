
import { ProductWithStore } from './types';
import { electronicsProducts } from './electronics-stores';
import { groceryProducts } from './grocery-stores';
import { homeOfficeProducts } from './home-office-stores';
import { healthToolsProducts } from './health-tools-stores';
import { clothingSportsProducts } from './clothing-sports-stores';
import { petSuppliesProducts } from './pet-supplies-stores';

export type { ProductWithStore } from './types';

export const products: ProductWithStore[] = [
  ...electronicsProducts,
  ...groceryProducts,
  ...homeOfficeProducts,
  ...healthToolsProducts,
  ...clothingSportsProducts,
  ...petSuppliesProducts
];

export const categories = [
  'All',
  'Electronics',
  'Home & Office',
  'Clothing',
  'Home & Kitchen',
  'Accessories',
  'Groceries',
  'Health',
  'Tools',
  'Sports',
  'Pet Supplies',
  'Office Supplies'
];
