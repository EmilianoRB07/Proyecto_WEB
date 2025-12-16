<?php
header("Content-Type: application/json; charset=utf-8");

// Ajusta estos 4 datos si tu MySQL tiene otros
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

// leer JSON (AJAX)
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "JSON inválido"]);
  exit;
}

$menor = $data["menor"] ?? null;
$trab = $data["trabajador"] ?? null;

if (!$menor || !$trab) {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Faltan datos"]);
  exit;
}

// ====== Trabajador ======
$correoInst = strtolower(trim($trab["correo_inst"] ?? ""));
$pass = $trab["pass"] ?? "";

if ($correoInst === "" || $pass === "") {
  http_response_code(400);
  echo json_encode(["ok" => false, "msg" => "Correo o contraseña vacíos"]);
  exit;
}

$passHash = password_hash($pass, PASSWORD_BCRYPT);

try {
  $pdo->beginTransaction();

  // si el trabajador ya existe, lo reutilizamos (para que pueda registrar más niños)
  $stmt = $pdo->prepare("SELECT id FROM trabajador WHERE correo_inst = ?");
  $stmt->execute([$correoInst]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($row) {
    $trabajadorId = (int)$row["id"];
  } else {
    $insT = $pdo->prepare("
      INSERT INTO trabajador
      (apP, apM, nombre, lugar_nac, fecha_nac, curp, genero, correo_inst, pass_hash,
       correo_personal, estado_civil, ocupacion, num_empleado, escolaridad, adscripcion, horario)
      VALUES
      (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ");

    $insT->execute([
      $trab["apP"], $trab["apM"], $trab["nombre"],
      $trab["lugar_nac"], $trab["fecha_nac"], $trab["curp"],
      $trab["genero"], $correoInst, $passHash,
      $trab["correo_personal"], $trab["estado_civil"], $trab["ocupacion"],
      $trab["num_empleado"], $trab["escolaridad"], $trab["adscripcion"], $trab["horario"]
    ]);

    $trabajadorId = (int)$pdo->lastInsertId();
  }

  // ====== Menor ======
  $insM = $pdo->prepare("
    INSERT INTO menor
    (trabajador_id, apP, apM, nombre, genero, lugar_nac, fecha_nac, curp, grupo_sanguineo,
     calle, numero, colonia, entidad, municipio, cp, telefono, grupo_asignado, cendi)
    VALUES
    (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  ");

  $insM->execute([
    $trabajadorId,
    $menor["apP"], $menor["apM"], $menor["nombre"], $menor["genero"],
    $menor["lugar_nac"], $menor["fecha_nac"], $menor["curp"], $menor["grupo_sanguineo"],
    $menor["calle"], $menor["numero"], $menor["colonia"], $menor["entidad"],
    $menor["municipio"], $menor["cp"], $menor["telefono"],
    $menor["grupo_asignado"], $menor["cendi"]
  ]);

  $pdo->commit();

  echo json_encode(["ok" => true, "msg" => "Registro guardado", "trabajador_id" => $trabajadorId]);
} catch (Exception $e) {
  $pdo->rollBack();
  http_response_code(500);
  echo json_encode(["ok" => false, "msg" => "Error al guardar", "detalle" => $e->getMessage()]);
}
