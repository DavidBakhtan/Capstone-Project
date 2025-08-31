// src/lib/apiClient.ts
type HttpMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';

const MODE = import.meta.env.VITE_API_MODE ?? 'auto'; // 'auto' | 'php' | 'json'
const PHP_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8082';
const JSON_BASE = import.meta.env.VITE_JSON_BASE ?? 'http://localhost:9090';

// مهلة سريعة لمحاولة PHP قبل التحويل لـ JSON
const PHP_TIMEOUT_MS = 1000;

function withLeadingSlash(path: string) {
  if (!path.startsWith('/')) return '/' + path;
  return path;
}
function buildUrl(base: string, path: string) {
  return base.replace(/\/+$/,'') + withLeadingSlash(path);
}
function timeout<T>(p: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(v => { clearTimeout(id); resolve(v); })
     .catch(e => { clearTimeout(id); reject(e); });
  });
}

async function doFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    credentials: 'include', // للـ PHP سيشن؛ JSON Server هيتجاهلها
    ...init,
    headers: {
      'Accept': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const ct = res.headers.get('content-type') ?? '';
  const isJson = ct.includes('application/json');
  const body = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const err = (isJson && body && body.error) ? body.error : `HTTP ${res.status}`;
    throw new Error(err);
  }
  return body;
}

async function fetchAuto(path: string, init?: RequestInit) {
  // جرّب PHP بسرعة ولو وقع/عمل timeout حوّل لـ JSON
  try {
    const phpUrl = buildUrl(PHP_BASE, path);
    const phpRes = await timeout(doFetch(phpUrl, init), PHP_TIMEOUT_MS);
    return phpRes;
  } catch {
    const jsonUrl = buildUrl(JSON_BASE, path);
    return await doFetch(jsonUrl, init);
  }
}

async function request(path: string, method: HttpMethod = 'GET', body?: any) {
  const p = withLeadingSlash(path);
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(body);
  }

  if (MODE === 'php')   return doFetch(buildUrl(PHP_BASE, p), init);
  if (MODE === 'json')  return doFetch(buildUrl(JSON_BASE, p), init);
  return fetchAuto(p, init); // auto
}

// واجهة بسيطة تستخدمها الصفحات
export const api = {
  get: (path: string) => request(path, 'GET'),
  post: (path: string, body?: any) => request(path, 'POST', body),
  put: (path: string, body?: any) => request(path, 'PUT', body),
  del: (path: string) => request(path, 'DELETE'),

  // Endpoints جاهزة
  health: () => api.get('/api/health'),
  categories: () => api.get('/api/categories'),              // ترجع array<string>
  products: (category?: string) => {
    const qs = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return api.get(`/api/products${qs}`);                    // { products: [...] }
  },
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  logout: () => api.post('/api/auth/logout'),
};