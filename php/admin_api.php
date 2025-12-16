<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/conexion.php";

$input = json_decode(file_get_contents("php://input"), true);
$action = $input["action"] ?? "";

function out($ok, $extra = []) {
  echo json_encode(array_merge(["ok" => $ok], $extra));
  exit;
}

/* ===== AUTH ===== */

if ($action === "login") {
  $usuario = trim($input["usuario"] ?? "");
  $pass    = (string)($input["pass"] ?? "");

  if ($usuario === "" || $pass === "") out(false, ["msg" => "Completa usuario y contraseña."]);

  $q = $pdo->prepare("SELECT id, usuario, pass_hash FROM admin WHERE usuario = ? LIMIT 1");
  $q->execute([$usuario]);
  $admin = $q->fetch();

  if (!$admin || !password_verify($pass, $admin["pass_hash"])) {
    out(false, ["msg" => "Credenciales incorrectas."]);
  }

  $_SESSION["admin_id"] = (int)$admin["id"];
  $_SESSION["admin_user"] = $admin["usuario"];
  out(true, ["usuario" => $admin["usuario"]]);
}

if ($action === "logout") {
  session_destroy();
  out(true);
}

if ($action === "me") {
  if (!isset($_SESSION["admin_id"])) out(false, ["msg" => "No autenticado"]);
  out(true, ["usuario" => ($_SESSION["admin_user"] ?? "Admin")]);
}

/* ===== PROTEGER CRUD ===== */
if (!isset($_SESSION["admin_id"])) out(false, ["msg" => "No autorizado"]);

/* ===== CRUD menor ===== */

if ($action === "list") {
  $q = $pdo->query("
    SELECT
      m.id,
      m.nombre,
      m.apP,
      m.apM,
      m.curp,
      m.cendi,
      m.grupo_asignado,
      CONCAT(t.nombre,' ',t.apP,' ',t.apM) AS trabajador,
      t.correo_inst AS correo_trabajador,
      m.creado_en AS created_at
    FROM menor m
    LEFT JOIN trabajador t ON t.id = m.trabajador_id
    ORDER BY m.creado_en DESC
  ");
  out(true, ["items" => $q->fetchAll()]);
}


if ($action === "get") {
  $id = (int)($input["id"] ?? 0);
  if ($id <= 0) out(false, ["msg" => "ID inválido"]);

  $q = $pdo->prepare("
    SELECT
      m.*,
      CONCAT(t.nombre,' ',t.apP,' ',t.apM) AS trabajador,
      t.correo_inst AS correo_trabajador
    FROM menor m
    LEFT JOIN trabajador t ON t.id = m.trabajador_id
    WHERE m.id = ?
    LIMIT 1
  ");
  $q->execute([$id]);
  $row = $q->fetch();

  if (!$row) out(false, ["msg" => "No encontrado"]);
  out(true, ["item" => $row]);
}


if ($action === "create") {
  $s = $input["sol"] ?? [];

  $nombre = trim($s["nombre"] ?? "");
  $apP    = trim($s["apP"] ?? "");
  $apM    = trim($s["apM"] ?? "");
  $curp   = strtoupper(trim($s["curp"] ?? ""));
  $cendi  = trim($s["cendi"] ?? "");
  $grupo  = trim($s["grupo_asignado"] ?? "");
  $trab   = trim($s["trabajador"] ?? "");
  $correo = trim($s["correo_trabajador"] ?? "");

  if ($nombre === "" || $apP === "" || $curp === "" || $cendi === "" || $grupo === "") {
    out(false, ["msg" => "Faltan obligatorios (Nombre, ApP, CURP, CENDI, Grupo)."]);
  }

  $q = $pdo->prepare("
    INSERT INTO menor (nombre, apP, apM, curp, cendi, grupo_asignado, trabajador, correo_trabajador, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  ");
  $q->execute([$nombre, $apP, $apM, $curp, $cendi, $grupo, $trab, $correo]);
  out(true);
}

if ($action === "update") {
  $id = (int)($input["id"] ?? 0);
  $s  = $input["sol"] ?? [];
  if ($id <= 0) out(false, ["msg" => "ID inválido"]);

  $nombre = trim($s["nombre"] ?? "");
  $apP    = trim($s["apP"] ?? "");
  $apM    = trim($s["apM"] ?? "");
  $curp   = strtoupper(trim($s["curp"] ?? ""));
  $cendi  = trim($s["cendi"] ?? "");
  $grupo  = trim($s["grupo_asignado"] ?? "");
  $trab   = trim($s["trabajador"] ?? "");
  $correo = trim($s["correo_trabajador"] ?? "");

  if ($nombre === "" || $apP === "" || $curp === "" || $cendi === "" || $grupo === "") {
    out(false, ["msg" => "Faltan obligatorios (Nombre, ApP, CURP, CENDI, Grupo)."]);
  }

  $q = $pdo->prepare("
    UPDATE menor SET
      nombre=?, apP=?, apM=?, curp=?, cendi=?, grupo_asignado=?, trabajador=?, correo_trabajador=?
    WHERE id=?
  ");
  $q->execute([$nombre, $apP, $apM, $curp, $cendi, $grupo, $trab, $correo, $id]);
  out(true);
}

if ($action === "delete") {
  $id = (int)($input["id"] ?? 0);
  if ($id <= 0) out(false, ["msg" => "ID inválido"]);

  $q = $pdo->prepare("DELETE FROM menor WHERE id = ?");
  $q->execute([$id]);
  out(true);
}

out(false, ["msg" => "Acción no válida"]);
