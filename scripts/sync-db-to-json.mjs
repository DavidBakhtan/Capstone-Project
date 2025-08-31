import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_NAME = process.env.DB_NAME || 'noknuk';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';

const OUT_DIR = 'db';
const OUT_FILE = path.join(OUT_DIR, 'db.json');

const ensureDir = p => fs.existsSync(p) || fs.mkdirSync(p, { recursive: true });
const toNumOrNull = v => (v === null || v === undefined) ? null : Number(v);

async function main() {
  const conn = await mysql.createConnection({
    host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASS, database: DB_NAME
  });

  const [catRows] = await conn.execute('SELECT name FROM categories ORDER BY name');
  const categories = catRows.map(r => r.name);

  const [prdRows] = await conn.execute(`
    SELECT id, name, description, price, original_price, sale_percentage, image_url, store, category_name
    FROM products ORDER BY id
  `);
  const products = prdRows.map(r => ({
    id: Number(r.id),
    name: r.name,
    description: r.description,
    price: Number(r.price),
    originalPrice: toNumOrNull(r.original_price),
    salePercentage: Number(r.sale_percentage || 0),
    isOnSale: Number(r.sale_percentage || 0) > 0,
    image: r.image_url,
    store: r.store,
    category: r.category_name,
  }));

  const [userRows] = await conn.execute(`
    SELECT id, full_name, email, role, COALESCE(status,'pending') AS status, COALESCE(is_active,1) AS is_active
    FROM users ORDER BY id
  `);
  const users = userRows.map(u => ({
    id: Number(u.id),
    full_name: u.full_name || '',
    email: u.email,
    role: u.role,
    status: u.status,
    is_active: Boolean(u.is_active),
  }));

  await conn.end();

  const data = {
    _meta: { generatedAt: new Date().toISOString() },
    categories,
    products,
    users
  };

  ensureDir(OUT_DIR);
  const tmp = OUT_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, OUT_FILE);

  console.log('✅ wrote', OUT_FILE);
}

main().catch(err => {
  console.error('❌ sync failed:', err);
  process.exit(1);
});
