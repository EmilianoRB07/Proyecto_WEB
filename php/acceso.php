<?php
header("Content-Type: application/json; charset=utf-8");
session_start();

// conexión
$DB_HOST = "localhost";
$DB_NAME = "cendi_db";
$DB_USER = "root";
$DB_PASS = "";

try {
  $pdo = new PDO(
    "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error conectando a la BD"]);
  exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$action = $data["action"] ?? "";

if ($action === "login") {

  $correo = strtolower(trim($data["correo"] ?? ""));
  $pass   = $data["pass"] ?? "";

  if ($correo === "" || $pass === "") {
    http_response_code(400);
    echo json_encode(["ok" => false, "msg" => "Faltan datos"]);
    exit;
  }

  $stmt = $pdo->prepare("SELECT id, correo_inst, pass_hash FROM trabajador WHERE correo_inst = ? LIMIT 1");
  $stmt->execute([$correo]);
  $t = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$t) {
    echo json_encode(["ok" => false, "msg" => "Usuario no registrado"]);
    exit;
  }

  if (!password_verify($pass, $t["pass_hash"])) {
    echo json_encode(["ok" => false, "msg" => "Contraseña incorrecta"]);
    exit;
  }

  $_SESSION["trabajador_id"] = (int)$t["id"];
  $_SESSION["correo_inst"] = $t["correo_inst"];

  // traer menores del trabajador
  $stmt2 = $pdo->prepare("
    SELECT
      apP, apM, nombre, curp, genero, fecha_nac,
      grupo_asignado, cendi,
      entidad, municipio, colonia, calle, numero, cp, telefono, grupo_sanguineo
    FROM menor
    WHERE trabajador_id = ?
    ORDER BY creado_en DESC
  ");
  $stmt2->execute([$_SESSION["trabajador_id"]]);
  $menores = $stmt2->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    "ok" => true,
    "correo" => $_SESSION["correo_inst"],
    "menores" => $menores
  ]);
  exit;
}

if ($action === "logout") {
  session_destroy();
  echo json_encode(["ok" => true]);
  exit;
}

http_response_code(400);
echo json_encode(["ok" => false, "msg" => "Acción inválida"]);
