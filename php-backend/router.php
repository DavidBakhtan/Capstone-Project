<?php
// شغّل السيرفر كده:
// php -S 0.0.0.0:8082 php-backend/router.php

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

$publicDir  = __DIR__ . '/public';
$realPublic = realpath($publicDir) ?: $publicDir;

// DEBUG: يظهر في لوج التيرمنال
error_log("[router] CWD=" . getcwd() . " URI={$uri} PUBLIC=" . ($realPublic ?: '(no realpath)'));

// اولاً: لو الملف ستاتيك تحت public، سيبه للسيرفر المدمج
$file = realpath($publicDir . $uri);
if ($file && $realPublic && str_starts_with($file, $realPublic) && is_file($file)) {
  return false; // let built-in server serve it
}

// صفحة فحص وتشخيص
if ($uri === '/__probe') {
  header('Content-Type: text/plain; charset=utf-8');
  $adminEntry = $publicDir . '/admin/index.php';
  echo "Router OK\n";
  echo "URI = {$uri}\n";
  echo "PUBLIC = " . ($realPublic ?: '(no realpath)') . "\n";
  echo "ADMIN_ENTRY = {$adminEntry}\n";
  echo "ADMIN_ENTRY_RESOLVED = " . (realpath($adminEntry) ?: '(not found)') . "\n";
  exit;
}

// API
if (preg_match('#^/api(?:/|$)#', $uri)) {
  $apiEntry = $publicDir . '/api/index.php';
  if (is_file($apiEntry)) {
    require $apiEntry;
    return;
  }
  http_response_code(500);
  header('Content-Type: text/plain; charset=utf-8');
  echo "API entry not found at:\n{$apiEntry}\n";
  echo "Resolved: " . (realpath($apiEntry) ?: '(not found)') . "\n";
  exit;
}

// Admin
if ($uri === '/admin' || preg_match('#^/admin(?:/.*)?$#', $uri)) {
  $adminEntry = $publicDir . '/admin/index.php';
  if (is_file($adminEntry)) {
    require $adminEntry;
    return;
  }
  http_response_code(500);
  header('Content-Type: text/plain; charset=utf-8');
  echo "Admin entry not found at:\n{$adminEntry}\n";
  echo "Resolved: " . (realpath($adminEntry) ?: '(not found)') . "\n";
  exit;
}

// هوم بسيطة (اختياري)
if ($uri === '/' || $uri === '/index.php') {
  $home = $publicDir . '/index.php';
  if (is_file($home)) { require $home; return; }
  header('Content-Type: text/html; charset=utf-8');
  echo "<h1>PHP Backend is up ✅</h1>
        <p><a href=\"/api/health\">/api/health</a> | <a href=\"/admin\">/admin</a> | <a href=\"/__probe\">/__probe</a></p>";
  return;
}

// 404 افتراضي
http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Not found', 'path' => $uri]);
