<?php
header("Content-Type: application/json; charset=utf-8");
session_set_cookie_params([
  "path" => "/",     // importantísimo
  "httponly" => true,
  "samesite" => "Lax"
]);
session_start();

if (!isset($_SESSION["trabajador_id"])) {
  http_response_code(401);
  echo json_encode(["ok" => false, "msg" => "Sesión no válida. Inicia sesión otra vez."]);
  exit;
}

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
  echo json_encode(["ok" => false, "msg" => "Error conectando a BD"]);
  exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$menor = $data["menor"] ?? null;
if (!$menor) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Faltan datos del menor"]);
  exit;
}

// ===== validaciones mínimas server-side =====
$required = ["apP","apM","nombre","genero","lugar_nac","fecha_nac","curp","grupo_sanguineo","calle","numero","colonia","entidad","municipio","cp","telefono","grupo_asignado","cendi"];
foreach ($required as $k) {
  if (!isset($menor[$k]) || trim((string)$menor[$k]) === "") {
    http_response_code(400);
    echo json_encode(["ok" => false, "msg" => "Campo faltante: $k"]);
    exit;
  }
}

$trabajadorId = (int)$_SESSION["trabajador_id"];
$cendi = trim($menor["cendi"]);
$grupo = trim($menor["grupo_asignado"]);
$curp  = strtoupper(trim($menor["curp"]));

try {
  // ===== cupo max 10 por CENDI+grupo =====
  $q = $pdo->prepare("SELECT COUNT(*) FROM menor WHERE cendi = ? AND grupo_asignado = ?");
  $q->execute([$cendi, $grupo]);
  $count = (int)$q->fetchColumn();

  if ($count >= 10) {
    http_response_code(409);
    echo json_encode(["ok" => false, "msg" => "Cupo lleno: ese CENDI y grupo ya tiene 10 inscritos."]);
    exit;
  }

  // opcional: evitar CURP duplicada global
  $q2 = $pdo->prepare("SELECT id FROM menor WHERE curp = ? LIMIT 1");
  $q2->execute([$curp]);
  if ($q2->fetch()) {
    http_response_code(409);
    echo json_encode(["ok" => false, "msg" => "Ya existe un menor registrado con esa CURP."]);
    exit;
  }

  $ins = $pdo->prepare("
    INSERT INTO menor
    (trabajador_id, apP, apM, nombre, genero, lugar_nac, fecha_nac, curp, grupo_sanguineo,
     calle, numero, colonia, entidad, municipio, cp, telefono, grupo_asignado, cendi)
    VALUES
    (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  ");

  $ins->execute([
    $trabajadorId,
    $menor["apP"], $menor["apM"], $menor["nombre"], $menor["genero"],
    $menor["lugar_nac"], $menor["fecha_nac"], $curp, $menor["grupo_sanguineo"],
    $menor["calle"], $menor["numero"], $menor["colonia"], $menor["entidad"],
    $menor["municipio"], $menor["cp"], $menor["telefono"],
    $grupo, $cendi
  ]);

  echo json_encode(["ok" => true, "msg" => "Menor agregado"]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al guardar", "detalle" => $e->getMessage()]);
}
