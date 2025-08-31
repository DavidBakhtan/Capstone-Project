// src/lib/api.ts
// عميل API ذكي: يجرب الـ PHP أولاً ثم JSON Server تلقائيًا، بدون بروكسي Vite

type Product = {
  id: number | string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  salePercentage?: number | null;
  isOnSale?: boolean;
  image?: string;
  store?: string;
  category?: string;
};

const PRIMARY = import.meta.env.VITE_API_PRIMARY?.replace(/\/+$/, '') || 'http://localhost:8082';
const FALLBACK = import.meta.env.VITE_API_FALLBACK?.replace(/\/+$/, '') || 'http://localhost:9090';

// لو حصلت نجاح من سيرفر معين بنحفظه للمرات الجاية (Cache last-good)
let lastGoodBase: string | null = null;
try {
  const saved = localStorage.getItem('api:lastGood');
  if (saved) lastGoodBase = saved;
} catch {}

function withTimeout(ms: number) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, cancel: () => clearTimeout(id) };
}

async function tryFetch(base: string, path: string, init?: RequestInit) {
  const url = `${base}${path}`;
  const { signal, cancel } = withTimeout(5000);
  try {
    const res = await fetch(url, {
      credentials: 'include',
      ...init,
      signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });
    cancel();
    return res;
  } catch (e) {
    cancel();
    throw e;
  }
}

async function request(path: string, init?: RequestInit): Promise<any> {
  // جرّب آخر سيرفر ناجح أولًا لو موجود
  const bases = lastGoodBase ? [lastGoodBase, PRIMARY, FALLBACK] : [PRIMARY, FALLBACK];
  const tried = new Set<string>();
  let lastErr: any = null;

  for (const base of bases) {
    if (!base || tried.has(base)) continue;
    tried.add(base);
    try {
      const res = await tryFetch(base, path, init);
      if (res.ok) {
        try {
          const data = await res.json();
          lastGoodBase = base;
          try { localStorage.setItem('api:lastGood', base); } catch {}
          return data;
        } catch (parseErr) {
          lastErr = parseErr;
          continue;
        }
      } else {
        // جرّب اللي بعده لو status مش 2xx
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }
    } catch (netErr) {
      lastErr = netErr;
      continue;
    }
  }
  throw lastErr || new Error('All backends failed');
}

/** ---- Endpoints موحدة الشكل ---- **/

export async function getCategories(): Promise<string[]> {
  const data = await request('/api/categories');
  // PHP: { categories: [...] }  |  JSON Server: [ ... ] أو {categories:[...]} لو عامل route
  let arr: string[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.categories)
      ? data.categories
      : [];

  // ضيف "All" أول عنصر لو مش موجودة
  if (!arr.includes('All')) arr = ['All', ...arr];
  return arr;
}

export async function getProducts(params?: { category?: string }): Promise<Product[]> {
  const qs = params?.category && params.category !== 'All'
    ? `?category=${encodeURIComponent(params.category)}`
    : '';

  const data = await request(`/api/products${qs}`);

  // PHP: { products: [...] }  |  JSON Server: [...]
  const list: any[] = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];

  // تطبيع الحقول
  return list.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description ?? '',
    price: Number(p.price),
    originalPrice: p.originalPrice ?? null,
    salePercentage: p.salePercentage ?? null,
    isOnSale: typeof p.isOnSale === 'boolean' ? p.isOnSale
              : (p.salePercentage ?? 0) > 0,
    image: p.image ?? p.image_url ?? '',
    store: p.store ?? '',
    category: p.category ?? p.category_name ?? '',
  }));
}

export async function createProduct(input: Partial<Product>) {
  const body = JSON.stringify({
    name: input.name ?? '',
    description: input.description ?? '',
    price: Number(input.price ?? 0),
    originalPrice: input.originalPrice ?? null,
    salePercentage: input.salePercentage ?? null,
    image: input.image ?? '',
    store: input.store ?? '',
    category: input.category ?? '',
  });

  const data = await request('/api/products', { method: 'POST', body });
  return data;
}

export async function updateProduct(id: number | string, input: Partial<Product>) {
  const body = JSON.stringify(input);
  const data = await request(`/api/products/${id}`, { method: 'PUT', body });
  return data;
}

export async function deleteProduct(id: number | string) {
  const data = await request(`/api/products/${id}`, { method: 'DELETE' });
  return data;
}
