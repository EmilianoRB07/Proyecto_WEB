<?php
$host = "localhost";
$db   = "cendi_db";      // nombre EXACTO de tu BD
$user = "root";
$pass = "";           // en XAMPP suele estar vacío
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

try {
  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    "ok" => false,
    "msg" => "Error de conexión a BD"
  ]);
  exit;
}
