<?php
// php-backend/public/index.php — API entrypoint موحّد

require __DIR__ . '/../db.php';
$config = require __DIR__ . '/../.env.php';

// CORS للتطوير (Vite على 8081)
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['http://localhost:8081','http://127.0.0.1:8081'];
if (in_array($origin, $allowed, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Access-Control-Allow-Credentials: true');
  header('Vary: Origin');
} else {
  header("Access-Control-Allow-Origin: *");
}
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(204); exit; }

$path   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ===== API =====

// GET /api/health
if (preg_match('#^/api/health/?$#', $path) && $method === 'GET') {
  json(['ok' => true]); // json() جاية من db.php
}

// POST /api/auth/login
if (preg_match('#^/api/auth/login/?$#', $path) && $method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true) ?: [];
  $email = $input['email'] ?? '';
  $password = $input['password'] ?? '';

  $stmt = $pdo->prepare('SELECT id, full_name, email, password_hash, role FROM users WHERE email=? LIMIT 1');
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  if (!$user || !password_verify($password, $user['password_hash'])) {
    json(['error' => 'Invalid credentials'], 401);
  }

  $token = base64_encode(hash_hmac('sha256', $user['id'].'|'.time(), $config['JWT_SECRET'], true));
  json([
    'token' => $token,
    'user'  => [
      'id'        => (int)$user['id'],
      'full_name' => (string)($user['full_name'] ?? ''),
      'email'     => $user['email'],
      'role'      => $user['role'],
    ],
  ]);
}

// GET /api/categories
if (preg_match('#^/api/categories/?$#', $path) && $method === 'GET') {
  $rows = $pdo->query('SELECT name FROM categories ORDER BY name')->fetchAll();
  $cats = array_map(fn($r) => $r['name'], $rows);
  array_unshift($cats, 'All');
  json(['categories' => $cats]);
}

// GET /api/products  (+ ?category=...)
if (preg_match('#^/api/products/?$#', $path) && $method === 'GET') {
  $cat = $_GET['category'] ?? 'All';

  if ($cat && $cat !== 'All') {
    $stmt = $pdo->prepare('SELECT id,name,description,price,original_price,sale_percentage,image_url,store,category_name 
                           FROM products WHERE category_name=? ORDER BY name');
    $stmt->execute([$cat]);
    $rows = $stmt->fetchAll();
  } else {
    $rows = $pdo->query('SELECT id,name,description,price,original_price,sale_percentage,image_url,store,category_name 
                         FROM products ORDER BY name')->fetchAll();
  }

  $out = array_map(function($r){
    return [
      'id'             => (int)$r['id'],
      'name'           => $r['name'],
      'description'    => $r['description'],
      'price'          => (float)$r['price'],
      'originalPrice'  => $r['original_price'] !== null ? (float)$r['original_price'] : null,
      'salePercentage' => $r['sale_percentage'] !== null ? (int)$r['sale_percentage'] : null,
      'isOnSale'       => $r['sale_percentage'] !== null && (int)$r['sale_percentage'] > 0,
      'image'          => $r['image_url'],
      'store'          => $r['store'],
      'category'       => $r['category_name'],
    ];
  }, $rows);

  json(['products' => $out, 'count' => count($out)]);
}

// ===== Admin placeholder =====
if ($path === '/admin' || preg_match('#^/admin/.*#', $path)) {
  $count = (int)($pdo->query('SELECT COUNT(*) c FROM products')->fetch()['c'] ?? 0);
  ?><!doctype html><html><head><meta charset="utf-8"><title>Admin</title>
  <style>body{font-family:system-ui;background:#0b1220;color:#e2e8f0;margin:0;padding:32px}
  .card{max-width:820px;margin:auto;background:#0f172a;border:1px solid #1f2937;border-radius:14px;padding:24px}
  a{color:#60a5fa}.btn{display:inline-block;padding:10px 14px;border-radius:10px;background:#2563eb;color:#fff;text-decoration:none}
  </style></head><body><div class="card">
  <h1>Admin Panel ✅</h1><p>Products in DB: <strong><?= $count ?></strong></p>
  <p><a href="/api/products">/api/products</a> | <a href="/api/categories">/api/categories</a></p>
  <p><a class="btn" href="http://localhost:8081/">← Back to Storefront</a></p>
  </div></body></html><?php
  exit;
}

// ===== fallback =====
if (str_starts_with($path, '/api/')) {
  json(['error' => 'Not found', 'path' => $path], 404);
}

?><!doctype html>
<html><head><meta charset="utf-8"><title>Backend</title></head>
<body style="font-family:system-ui;padding:24px">
  <h1>PHP Backend is up ✅</h1>
  <p>Try <a href="/api/health">/api/health</a></p>
</body></html>
