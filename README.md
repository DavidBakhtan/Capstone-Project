NokNuk Storefront – Developer Guide

React + Vite storefront with a lightweight PHP + MySQL API, and an optional JSON Server fallback for offline/dev data.

Requirements

Node.js 18+ and npm

PHP 8.1+ (built-in server is fine)

MySQL 8+

cURL (optional, for quick API tests)

Default Ports

Frontend (Vite): 8081

PHP API: 8082

JSON Server (fallback): 9090

MySQL: 3306 (default)

1) Install dependencies
npm install

2) Database: schema & seed

Import the SQL dump:

mysql -u root -p < noknuk_dump.sql


This creates the noknuk database with the required tables (users, categories, products) and sample data.

If you want a root@site.com admin user:

Generate a bcrypt hash:

php -r "echo password_hash('admin123', PASSWORD_BCRYPT), PHP_EOL;"


Use that hash in the INSERT for the root user (uncomment/adjust in the dump if needed).

3) Configuration
3.1 Project-level .env (used by the sync script)

Create a .env in the project root:

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=noknuk
DB_USER=root
DB_PASS=your_password

3.2 PHP backend config

Create php-backend/.env.php:

<?php
return [
  'DB_HOST' => '127.0.0.1',
  'DB_PORT' => 3306,
  'DB_NAME' => 'noknuk',
  'DB_USER' => 'root',
  'DB_PASS' => 'your_password',
  'JWT_SECRET' => 'change_me_to_a_long_random_string'
];

4) Running services (development)

Open three terminals:

4.1 PHP API (port 8082)

From the project root:

php -S 127.0.0.1:8082 -t php-backend/public php-backend/router.php


Health endpoint: http://localhost:8082/api/health

Admin page (simple panel): http://localhost:8082/admin

4.2 JSON Server fallback (port 9090)
npm run json:serve


It serves from db/db.json. Route mapping (via json-server.routes.json):

/api/products* → /products$1

/api/categories* → /categories$1

/api/users* → /users$1

4.3 Frontend (Vite, port 8081)
npm run dev -- --port 8081


The frontend calls /api/.... In dev, make sure your Vite proxy points to http://localhost:8082 (PHP).
If you want to use JSON Server instead, set VITE_API_BASE=http://localhost:9090 or update the proxy accordingly.

5) Sync MySQL → JSON (for offline/fallback)
One-off sync
npm run sync:json

Watch mode (every 15s)
node scripts/sync-db-to-json.mjs --watch 15


Output: db/db.json with:

_meta.generatedAt (timestamp)

categories (array)

products (array)

users (array)

Important: JSON Server does not accept arbitrary top-level scalar fields. The timestamp must live under _meta.generatedAt (not a top-level generatedAt), which the sync script already ensures.

6) API endpoints (PHP)

GET /api/health

POST /api/auth/login — body {email, password}

POST /api/auth/logout

GET /api/auth/me — returns the current session user (if any)

GET /api/categories

GET /api/products — supports ?category=...

POST /api/products — roles: admin, root, tech

PUT|PATCH /api/products/:id — roles: admin, root, tech

DELETE /api/products/:id — roles: admin, root

GET /api/users?status=pending — roles: admin, root

POST /api/users/approve — body {user_id, role} — roles: admin, root

Quick cURL examples
# Health
curl -i http://localhost:8082/api/health

# Login (example root user)
curl -i -X POST http://localhost:8082/api/auth/login \
  -H 'Content-Type: application/json' \
  --data '{"email":"root@site.com","password":"admin123"}'

# List products
curl -i http://localhost:8082/api/products
curl -i 'http://localhost:8082/api/products?category=Electronics'

7) Project structure
noknuk-aura-storefront/
├─ php-backend/
│  ├─ public/
│  │  ├─ api/            # REST entrypoint
│  │  └─ admin.php       # simple admin panel (or admin entry)
│  ├─ db.php
│  ├─ router.php
│  └─ .env.php           # PHP config
├─ db/
│  ├─ db.json            # JSON Server database (generated)
│  └─ json-server.routes.json
├─ scripts/
│  └─ sync-db-to-json.mjs
├─ src/                  # React app
├─ package.json
├─ vite.config.ts
└─ README.md

8) Troubleshooting

Port already in use (EADDRINUSE)
Find & kill process:

lsof -i :9090
kill -9 <PID>


(Change the port number as needed.)

CORS / Session issues
PHP allows http://localhost:8081 by default. If you change the frontend port, update the whitelist in the PHP API CORS block.

JSON Server complains about generatedAt
Ensure the timestamp lives under _meta.generatedAt. Re-run:

npm run sync:json


No data when PHP is down
Either:

set VITE_API_BASE=http://localhost:9090, or

change the Vite proxy to target http://localhost:9090 during fallback.

Browserslist warning
It’s harmless. If you want to silence it:

npx update-browserslist-db@latest

9) Credentials (example)

If you inserted the example admin:

Email: root@site.com

Password: admin123

10) Assets & licenses

Product images are Unsplash URLs and used for demo purposes only.


## Quick links

- Storefront (Home): http://localhost:8081/
- Login: http://localhost:8081/login
- Admin Panel (PHP): http://localhost:8082/admin
- API Health: http://localhost:8082/api/health
- API Products: http://localhost:8082/api/products
- JSON fallback (when PHP is down):
  - http://localhost:9090/products
  - http://localhost:9090/categories
  - http://localhost:9090/_meta


Happy hacking! If you hit anything odd (routing, proxy, or data sync), check the ports and the Vite proxy/API base first.