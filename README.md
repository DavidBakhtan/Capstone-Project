# NokNuk Storefront – Developer Guide

React + Vite storefront with a lightweight PHP + MySQL API, and an optional JSON Server fallback for offline/dev data.

## Table of Contents

* [Requirements](#requirements)
* [Default Ports](#default-ports)
* [1) Install dependencies](#1-install-dependencies)
* [2) Database: schema & seed](#2-database-schema--seed)
* [3) Configuration](#3-configuration)

  * [3.1 Project-level `.env` (sync script)](#31-project-level-env-sync-script)
  * [3.2 PHP backend config](#32-php-backend-config)
* [4) Running services (development)](#4-running-services-development)

  * [4.1 PHP API (8082)](#41-php-api-8082)
  * [4.2 JSON Server fallback (9090)](#42-json-server-fallback-9090)
  * [4.3 Frontend (Vite, 8081)](#43-frontend-vite-8081)
* [5) Sync MySQL → JSON (offline/fallback)](#5-sync-mysql--json-offlinefallback)
* [6) API endpoints (PHP)](#6-api-endpoints-php)
* [7) Quick cURL examples](#7-quick-curl-examples)
* [8) Project structure](#8-project-structure)
* [9) Troubleshooting](#9-troubleshooting)
* [10) Credentials (example)](#10-credentials-example)
* [11) Assets & licenses](#11-assets--licenses)
* [Quick links](#quick-links)

---

## Requirements

* Node.js 18+ and npm
* PHP 8.1+ (built-in server is fine)
* MySQL 8+
* cURL (optional, for quick API tests)

## Default Ports

* **Frontend (Vite):** `8081`
* **PHP API:** `8082`
* **JSON Server (fallback):** `9090`
* **MySQL:** `3306` (default)

---

## 1) Install dependencies

```bash
npm install
```

---

## 2) Database: schema & seed

Import the SQL dump:

```bash
mysql -u root -p < noknuk_dump.sql
```

This creates the `noknuk` database with tables (`users`, `categories`, `products`) and sample data.

**Optional: root admin user**

```bash
php -r "echo password_hash('admin123', PASSWORD_BCRYPT), PHP_EOL;"
```

Use the generated hash in the `INSERT` for `root@site.com` (uncomment/adjust in the dump if needed).

---

## 3) Configuration

### 3.1 Project-level `.env` (sync script)

Create a `.env` in the project root:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=noknuk
DB_USER=root
DB_PASS=your_password
```

### 3.2 PHP backend config

Create `php-backend/.env.php`:

```php
<?php
return [
  'DB_HOST' => '127.0.0.1',
  'DB_PORT' => 3306,
  'DB_NAME' => 'noknuk',
  'DB_USER' => 'root',
  'DB_PASS' => 'your_password',
  'JWT_SECRET' => 'change_me_to_a_long_random_string'
];
```

---

## 4) Running services (development)

Open **three terminals**:

### 4.1 PHP API (8082)

From the project root:

```bash
php -S 127.0.0.1:8082 -t php-backend/public php-backend/router.php
```

* Health: [http://localhost:8082/api/health](http://localhost:8082/api/health)
* Admin:  [http://localhost:8082/admin](http://localhost:8082/admin)

### 4.2 JSON Server fallback (9090)

```bash
npm run json:serve
```

Serves from `db/db.json`. Route mapping (`json-server.routes.json`):

```
/api/products*   -> /products$1
/api/categories* -> /categories$1
/api/users*      -> /users$1
/api/*           -> /$1
```

### 4.3 Frontend (Vite, 8081)

```bash
npm run dev -- --port 8081
```

The frontend calls `/api/...`.

* For **PHP backend** in dev: make sure Vite proxy targets `http://localhost:8082`.
* For **JSON fallback**: set `VITE_API_BASE=http://localhost:9090` (or update the proxy to 9090).

---

## 5) Sync MySQL → JSON (offline/fallback)

**One-off sync**

```bash
npm run sync:json
```

**Watch mode (every 15s)**

```bash
node scripts/sync-db-to-json.mjs --watch 15
```

**Output:** `db/db.json` with:

* `_meta.generatedAt` (timestamp)
* `categories` (array)
* `products` (array)
* `users` (array)

> **Important:** JSON Server does **not** accept arbitrary top-level scalar fields. The timestamp must live under `_meta.generatedAt` (the sync script already does this).

---

## 6) API endpoints (PHP)

* `GET /api/health`
* `POST /api/auth/login` — body `{ email, password }`
* `POST /api/auth/logout`
* `GET /api/auth/me` — returns the current session user (if any)
* `GET /api/categories`
* `GET /api/products` — supports `?category=...`
* `POST /api/products` — roles: `admin`, `root`, `tech`
* `PUT|PATCH /api/products/:id` — roles: `admin`, `root`, `tech`
* `DELETE /api/products/:id` — roles: `admin`, `root`
* `GET /api/users?status=pending` — roles: `admin`, `root`
* `POST /api/users/approve` — body `{ user_id, role }` — roles: `admin`, `root`

---

## 7) Quick cURL examples

```bash
# Health
curl -i http://localhost:8082/api/health

# Login (example root user)
curl -i -X POST http://localhost:8082/api/auth/login \
  -H 'Content-Type: application/json' \
  --data '{"email":"root@site.com","password":"admin123"}'

# List products
curl -i http://localhost:8082/api/products
curl -i 'http://localhost:8082/api/products?category=Electronics'
```

---

## 8) Project structure

```
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
```

---

## 9) Troubleshooting

**Port already in use (EADDRINUSE)**

```bash
lsof -i :9090
kill -9 <PID>
```

(Change port number as needed.)

**CORS / Session issues**
PHP allows `http://localhost:8081` by default. If you change the frontend port, update the CORS whitelist in the PHP API.

**JSON Server complains about `generatedAt`**
Keep the timestamp under `_meta.generatedAt`. Re-run:

```bash
npm run sync:json
```

**No data when PHP is down**
Either set:

```bash
VITE_API_BASE=http://localhost:9090
```

or point the Vite proxy to `http://localhost:9090` during fallback.

**Browserslist warning**
Harmless. To update:

```bash
npx update-browserslist-db@latest
```

---

## 10) Credentials (example)

If you inserted the example admin:

* **Email:** `root@site.com`
* **Password:** `admin123`

---

## 11) Assets & licenses

Product images are Unsplash URLs and used for demo purposes only.

---

## Quick links

* Storefront (Home): **[http://localhost:8081/](http://localhost:8081/)**
* Login: **[http://localhost:8081/login](http://localhost:8081/login)**
* Admin Panel (PHP): **[http://localhost:8082/admin](http://localhost:8082/admin)**
* API Health: **[http://localhost:8082/api/health](http://localhost:8082/api/health)**
* API Products: **[http://localhost:8082/api/products](http://localhost:8082/api/products)**
* JSON fallback (when PHP is down):

  * **[http://localhost:9090/products](http://localhost:9090/products)**
  * **[http://localhost:9090/categories](http://localhost:9090/categories)**
  * **[http://localhost:9090/\_meta](http://localhost:9090/_meta)**

