import type { ProductWithStore } from './types';
import { products as localProducts } from './products';
import { categories as localCategories } from './products';
const API_BASE =
  import.meta.env.VITE_API_BASE ?? 'http://localhost:8083';

export async function fetchProducts(category?: string): Promise<ProductWithStore[]> {
  try {
    const url = new URL('/api/products', window.location.origin);
    if (category && category !== 'All') url.searchParams.set('category', category);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    return data.products as ProductWithStore[];
  } catch {
    return localProducts.filter((p: any) => !category || category === 'All' || p.category === category);
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const res = await fetch('/api/categories', { cache: 'no-store' });
    if (!res.ok) throw new Error('bad');
    const data = await res.json();
    return data.categories as string[];
  } catch {
    return localCategories;
  }
}
