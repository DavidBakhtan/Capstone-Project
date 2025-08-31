// ESM version — sync DB (MySQL) -> db/db.json
// Run:
//   node scripts/sync-db-to-json.js
//   node scripts/sync-db-to-json.js --watch 15

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// load .env from project root
dotenv.config({ path: path.join(projectRoot, ".env") });

// validate env
const {
  DB_HOST = "127.0.0.1",
  DB_PORT = "3306",
  DB_NAME = "noknuk",
  DB_USER = "root",
  DB_PASS = "",
} = process.env;

const OUTPUT_DIR = path.join(projectRoot, "db");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "db.json");

// parse args
function parseArgs() {
  const args = process.argv.slice(2);
  const idx = args.indexOf("--watch");
  let watchSec = null;
  if (idx !== -1) {
    const val = Number(args[idx + 1] ?? "15");
    watchSec = Number.isFinite(val) && val > 0 ? val : 15;
  }
  return { watchSec };
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

function now() {
  return new Date().toISOString();
}

async function fetchAll(pool) {
  // categories
  const [catRows] = await pool.query(
    "SELECT name FROM categories ORDER BY name"
  );
  const categories = catRows.map((r) => r.name);

  // products
  const [prodRows] = await pool.query(
    `SELECT id,name,description,price,original_price,sale_percentage,image_url,store,category_name
     FROM products
     ORDER BY id`
  );

  const products = prodRows.map((r) => ({
    id: Number(r.id),
    name: r.name,
    description: r.description,
    price: Number(r.price),
    originalPrice:
      r.original_price !== null ? Number(r.original_price) : null,
    salePercentage:
      r.sale_percentage !== null ? Number(r.sale_percentage) : null,
    isOnSale:
      r.sale_percentage !== null && Number(r.sale_percentage) > 0,
    image: r.image_url,
    store: r.store,
    category: r.category_name,
  }));

  // (اختياري) users للتجارب الأوفلاين بدون بيانات حساسة
  // بنكتفي بإرجاع count فقط عشان الأمان.
  const [userCountRows] = await pool.query(
    "SELECT COUNT(*) AS c FROM users"
  );
  const users = { count: Number(userCountRows[0]?.c ?? 0) };

  return { categories, products, users };
}

async function writeJson(data) {
  await ensureDir(OUTPUT_DIR);
  const payload = {
    generatedAt: now(),
    ...data,
  };
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf8");
}

async function syncOnce(pool) {
  const data = await fetchAll(pool);
  await writeJson(data);
  console.log(
    `[sync-db-to-json] Wrote ${data.products.length} products, ${data.categories.length} categories -> db/db.json @ ${new Date().toLocaleString()}`
  );
}

async function main() {
  const { watchSec } = parseArgs();

  const pool = await mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    await syncOnce(pool);
  } catch (e) {
    console.error("[sync-db-to-json] First run failed:", e.message);
    if (!watchSec) {
      await pool.end();
      process.exit(1);
    }
  }

  if (watchSec) {
    console.log(`[sync-db-to-json] Watching every ${watchSec}s… (Ctrl+C to stop)`);
    setInterval(async () => {
      try {
        await syncOnce(pool);
      } catch (e) {
        console.error("[sync-db-to-json] Sync error:", e.message);
      }
    }, watchSec * 1000);
  } else {
    await pool.end();
  }
}

main().catch((e) => {
  console.error("[sync-db-to-json] Fatal:", e);
  process.exit(1);
});
