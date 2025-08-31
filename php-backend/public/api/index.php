<?php
// php-backend/public/api/index.php — Unified API (sessions + auth + products + users)

// ==== bootstrap ====
require __DIR__ . '/../../db.php';        // يوفّر $pdo و json()
$config = require __DIR__ . '/../../.env.php';

// ---- CORS (Vite على 8081) ----
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
// --------------------------------

$path   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// helpers
function route_is(string $rx): bool { global $path; return (bool)preg_match($rx, $path); }
function start_sess(): void {
  if (session_status() !== PHP_SESSION_ACTIVE) {
    $params = session_get_cookie_params();
    session_set_cookie_params([
      'lifetime' => 0,
      'path'     => $params['path'] ?? '/',
      'domain'   => $params['domain'] ?? '',
      'secure'   => false,
      'httponly' => true,
      'samesite' => 'Lax',
    ]);
    session_start();
  }
}
function current_user(): ?array {
  start_sess();
  if (!isset($_SESSION['uid'])) return null;
  global $pdo;
  $st = $pdo->prepare('SELECT id, full_name, email, role, status, is_active FROM users WHERE id=?');
  $st->execute([$_SESSION['uid']]);
  return $st->fetch() ?: null;
}
function require_role(array $roles): void {
  $u = current_user();
  if (!$u || !in_array($u['role'], $roles, true)) {
    json(['error' => 'Forbidden'], 403);
  }
}

// =================== Routes ===================

// GET /api/health
if (route_is('#^/api/health/?$#') && $method === 'GET') {
  json(['ok' => true]);
}

// POST /api/auth/signup  {full_name, email, password}
// ينشئ يوزر new: role=tech, status=pending, is_active=0 (لا يدخل غير بعد موافقة أدمن/رووت)
if (route_is('#^/api/auth/signup/?$#') && $method === 'POST') {
  $in = json_decode(file_get_contents('php://input'), true) ?: [];
  $full_name = trim((string)($in['full_name'] ?? ''));
  $email     = trim((string)($in['email'] ?? ''));
  $password  = (string)($in['password'] ?? '');

  if ($email === '' || $password === '') {
    json(['error' => 'Email and password are required'], 400);
  }
  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json(['error' => 'Invalid email'], 422);
  }
  $password_hash = password_hash($password, PASSWORD_BCRYPT);

  try {
    $st = $pdo->prepare('INSERT INTO users (full_name,email,password_hash,role,status,is_active,created_at)
                         VALUES (?,?,?,?,?,?,NOW())');
    $st->execute([$full_name, $email, $password_hash, 'tech', 'pending', 0]);
  } catch (PDOException $e) {
    // duplicate email
    if ($e->getCode() === '23000') {
      json(['error' => 'Email already exists'], 409);
    }
    throw $e;
  }

  json([
    'message' => 'Account created, pending approval by admin',
    'user' => [
      'id' => (int)$pdo->lastInsertId(),
      'full_name' => $full_name,
      'email' => $email,
      'role' => 'tech',
      'status' => 'pending',
    ]
  ], 201);
}

// POST /api/auth/login  {email,password}
if (route_is('#^/api/auth/login/?$#') && $method === 'POST') {
  $in = json_decode(file_get_contents('php://input'), true) ?: [];
  $email = trim((string)($in['email'] ?? ''));
  $password = (string)($in['password'] ?? '');

  if ($email === '' || $password === '') {
    json(['error' => 'Email and password are required'], 400);
  }

  // case-insensitive
  $stmt = $pdo->prepare('SELECT id, full_name, email, password_hash, role, status, is_active
                         FROM users WHERE LOWER(email)=LOWER(?) LIMIT 1');
  $stmt->execute([$email]);
  $u = $stmt->fetch();

  if (!$u || !password_verify($password, $u['password_hash'])) {
    json(['error' => 'Invalid credentials'], 401);
  }

  // root يُسمح له الدخول حتى لو status != active
  $status = (string)($u['status'] ?? 'pending');
  $role   = (string)($u['role']   ?? 'guest');
  if ($role !== 'root') {
    if ((int)($u['is_active'] ?? 1) === 0) {
      json(['error' => 'Account deactivated'], 403);
    }
    if ($status !== 'active') {
      json(['error' => 'Account pending approval'], 403);
    }
  }

  start_sess();
  $_SESSION['uid']  = (int)$u['id'];
  $_SESSION['role'] = $role;
  setcookie('auth_role', $role, ['path'=>'/','httponly'=>false,'samesite'=>'Lax']);

  json([
    'user'  => [
      'id'=>(int)$u['id'],
      'full_name'=>$u['full_name'] ?? '',
      'email'=>$u['email'],
      'role'=>$role,
      'status'=>$status
    ],
    'message' => 'ok'
  ]);
}

// POST /api/auth/logout
if (route_is('#^/api/auth/logout/?$#') && $method === 'POST') {
  start_sess();
  $_SESSION = [];
  if (ini_get("session.use_cookies")) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p["path"], $p["domain"], $p["secure"], $p["httponly"]);
  }
  session_destroy();
  setcookie('auth_role','', time()-3600, '/');
  json(['message' => 'logged out']);
}

// GET /api/auth/me
if (route_is('#^/api/auth/me/?$#') && $method === 'GET') {
  $u = current_user();
  json(['user' => $u ?: null]);
}

// ---------- Categories ----------
if (route_is('#^/api/categories/?$#') && $method === 'GET') {
  $rows = $pdo->query('SELECT name FROM categories ORDER BY name')->fetchAll();
  $cats = array_map(fn($r) => $r['name'], $rows);
  array_unshift($cats, 'All');
  json(['categories' => $cats]);
}

// ---------- Products ----------
if (route_is('#^/api/products/?$#') && $method === 'GET') {
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
      'salePercentage' => $r['sale_percentage'] !== null ? (int)$r['sale_percentage'] : 0,
      'isOnSale'       => $r['sale_percentage'] !== null && (int)$r['sale_percentage'] > 0,
      'image'          => $r['image_url'],
      'store'          => $r['store'],
      'category'       => $r['category_name'],
    ];
  }, $rows);

  json(['products' => $out, 'count' => count($out)]);
}

// create product
if (route_is('#^/api/products/?$#') && $method === 'POST') {
  require_role(['admin','root','tech']);
  $b = json_decode(file_get_contents('php://input'), true) ?: [];
  $st = $pdo->prepare('INSERT INTO products (name,description,price,original_price,sale_percentage,image_url,store,category_name)
                       VALUES (?,?,?,?,?,?,?,?)');
  $st->execute([
    (string)($b['name'] ?? ''),
    (string)($b['description'] ?? ''),
    (float)($b['price'] ?? 0),
    isset($b['originalPrice']) ? (float)$b['originalPrice'] : 0,
    isset($b['salePercentage']) ? (int)$b['salePercentage'] : 0,
    (string)($b['image'] ?? ''),
    (string)($b['store'] ?? ''),
    (string)($b['category'] ?? ''),
  ]);
  json(['id' => (int)$pdo->lastInsertId()], 201);
}

// update/delete by id
if (preg_match('#^/api/products/(\d+)/?$#', $path, $m)) {
  $id = (int)$m[1];
  if ($method === 'PUT' || $method === 'PATCH') {
    require_role(['admin','root','tech']);
    $b = json_decode(file_get_contents('php://input'), true) ?: [];
    $sets = []; $vals = [];
    $map = [
      'name' => 'name', 'description' => 'description', 'price' => 'price',
      'originalPrice' => 'original_price', 'salePercentage' => 'sale_percentage',
      'image' => 'image_url', 'store' => 'store', 'category' => 'category_name'
    ];
    foreach ($map as $in => $col) {
      if (array_key_exists($in, $b)) { $sets[] = "$col=?"; $vals[] = $b[$in]; }
    }
    if (!$sets) json(['message'=>'nothing to update']);
    $vals[] = $id;
    $sql = 'UPDATE products SET ' . implode(',', $sets) . ' WHERE id=?';
    $pdo->prepare($sql)->execute($vals);
    json(['message'=>'updated']);
  }
  if ($method === 'DELETE') {
    require_role(['admin','root']);
    $pdo->prepare('DELETE FROM products WHERE id=?')->execute([$id]);
    json(['message'=>'deleted']);
  }
}

// ---------- Users (approval) ----------
// GET /api/users?status=pending
if (route_is('#^/api/users/?$#') && $method === 'GET') {
  require_role(['admin','root']);
  $status = $_GET['status'] ?? null;
  if ($status) {
    $st = $pdo->prepare('SELECT id, full_name, email, role, status FROM users WHERE status=? ORDER BY id DESC');
    $st->execute([$status]);
  } else {
    $st = $pdo->query('SELECT id, full_name, email, role, status FROM users ORDER BY id DESC');
  }
  json(['users' => $st->fetchAll()]);
}

// POST /api/users/approve {user_id, role}
if (route_is('#^/api/users/approve/?$#') && $method === 'POST') {
  require_role(['admin','root']);
  $b = json_decode(file_get_contents('php://input'), true) ?: [];
  $uid = (int)($b['user_id'] ?? 0);
  $role = (string)($b['role'] ?? 'tech');
  if (!$uid) json(['error'=>'user_id required'], 400);
  $pdo->prepare('UPDATE users SET role=?, status="active", is_active=1 WHERE id=?')->execute([$role, $uid]);
  json(['message'=>'approved']);
}

// ---- 404 for unknown /api/* ----
if (str_starts_with($path, '/api/')) {
  json(['error' => 'Not found', 'path' => $path], 404);
}

// fallback (non-API)
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Wrong entry', 'path' => $path]);
