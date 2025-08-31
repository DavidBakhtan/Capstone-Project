<?php
declare(strict_types=1);

$configPath = __DIR__.'/.env.php';
if (!file_exists($configPath)) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Missing php-backend/.env.php']);
  exit;
}
$config = require $configPath;

$host = (string)($config['DB_HOST'] ?? '127.0.0.1');
$port = (int)   ($config['DB_PORT'] ?? 3306);
$name = (string)($config['DB_NAME'] ?? '');
$user = (string)($config['DB_USER'] ?? 'root');
$pass = (string)($config['DB_PASS'] ?? '');

if ($name === '') {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'DB_NAME is empty in .env.php']);
  exit;
}
if (!in_array('mysql', \PDO::getAvailableDrivers(), true)) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'PDO MySQL driver not loaded (pdo_mysql). Enable it in php.ini']);
  exit;
}

$dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $host, $port, $name);
$options = [
  \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
  \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
];
try {
  $pdo = new \PDO($dsn, $user, $pass, $options);
} catch (\Throwable $e) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode([
    'error' => 'DB connect failed',
    'detail'=> $e->getMessage(),
  ]);
  exit;
}

function json($data, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json');
  echo json_encode($data);
  exit;
}
function bearer_token(): ?string {
  $h = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['Authorization'] ?? '';
  return preg_match('/Bearer\s+(.+)/i', $h, $m) ? trim($m[1]) : null;
}
