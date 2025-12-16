const API = "php/admin_api.php";

const formLogin = document.getElementById("loginAdmin");
const usuarioEl = document.getElementById("usuarioA");
const passEl = document.getElementById("passwordAdmin");

const cardLogin = document.getElementById("cardAdminLogin");
const panelAdmin = document.getElementById("panelAdmin");
const tbody = document.getElementById("tbodySolicitudes");
const adminInfo = document.getElementById("adminInfo");

const btnCerrar = document.getElementById("btnAdminCerrar");
const btnRefrescar = document.getElementById("btnRefrescar");
const btnCrear = document.getElementById("btnCrear");

const togglePass = document.getElementById("togglePass");

// Modal (seguro)
const modalEl = document.getElementById("modalSol");
const modal = modalEl ? new bootstrap.Modal(modalEl) : null;
const modalTitle = document.getElementById("modalTitle");
const btnGuardar = document.getElementById("btnGuardar");

// Inputs modal
const sol_id = document.getElementById("sol_id");
const sol_nombre = document.getElementById("sol_nombre");
const sol_apP = document.getElementById("sol_apP");
const sol_apM = document.getElementById("sol_apM");
const sol_curp = document.getElementById("sol_curp");
const sol_cendi = document.getElementById("sol_cendi");
const sol_grupo = document.getElementById("sol_grupo");
const sol_trabajador = document.getElementById("sol_trabajador");
const sol_correo = document.getElementById("sol_correo");

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function api(action, payload = {}) {
  const r = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ action, ...payload })
  });
  return r.json();
}

function mostrarPanel(usuario) {
  cardLogin.classList.add("d-none");
  panelAdmin.classList.remove("d-none");
  adminInfo.textContent = `Sesión: ${usuario || "Admin"}`;
}

function mostrarLogin() {
  panelAdmin.classList.add("d-none");
  cardLogin.classList.remove("d-none");
  adminInfo.textContent = "";
  tbody.innerHTML = "";
  formLogin.reset();
}

function limpiarModal() {
  sol_id.value = "";
  sol_nombre.value = "";
  sol_apP.value = "";
  sol_apM.value = "";
  sol_curp.value = "";
  sol_cendi.value = "";
  sol_grupo.value = "";
  sol_trabajador.value = "";
  sol_correo.value = "";
}

function solFromInputs() {
  return {
    nombre: sol_nombre.value.trim(),
    apP: sol_apP.value.trim(),
    apM: sol_apM.value.trim(),
    curp: sol_curp.value.trim().toUpperCase(),
    cendi: sol_cendi.value.trim(),
    grupo_asignado: sol_grupo.value.trim(),
    trabajador: sol_trabajador.value.trim(),
    correo_trabajador: sol_correo.value.trim()
  };
}

function renderTable(items) {
  if (!items || items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No hay solicitudes registradas.</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(r => `
    <tr>
      <td>${escapeHTML(r.id)}</td>
      <td><strong>${escapeHTML(r.nombre)} ${escapeHTML(r.apP)} ${escapeHTML(r.apM)}</strong></td>
      <td>${escapeHTML(r.curp)}</td>
      <td>${escapeHTML(r.cendi)}</td>
      <td>${escapeHTML(r.grupo_asignado)}</td>
      <td>${escapeHTML(r.trabajador || "")}</td>
      <td>${escapeHTML(r.correo_trabajador || "")}</td>
      <td class="small text-muted">${escapeHTML(r.created_at || "")}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary me-1" data-action="edit" data-id="${r.id}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" data-action="del" data-id="${r.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

async function cargarLista() {
  const r = await api("list");
  if (!r.ok) return alert(r.msg || "No se pudo cargar");
  renderTable(r.items);
}

// Mostrar/ocultar password
if (togglePass) {
  togglePass.addEventListener("click", () => {
    const isPass = passEl.type === "password";
    passEl.type = isPass ? "text" : "password";
    togglePass.classList.toggle("bi-eye-fill", !isPass);
    togglePass.classList.toggle("bi-eye-slash-fill", isPass);
  });
}

// Login
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
    console.log("submit capturado ✅");   // 👈 añade esto

  const usuario = (usuarioEl.value || "").trim();
  const pass = (passEl.value || "");

  const r = await api("login", { usuario, pass });
    console.log("respuesta login:", r);  // 👈 y este también

  if (!r.ok) return alert(r.msg || "No se pudo iniciar sesión");

  mostrarPanel(r.usuario || usuario);
  cargarLista();
});

// Logout
btnCerrar.addEventListener("click", async () => {
  await api("logout");
  mostrarLogin();
});

// Refrescar
btnRefrescar.addEventListener("click", cargarLista);

// Crear
btnCrear.addEventListener("click", () => {
  limpiarModal();
  modalTitle.textContent = "Nueva solicitud";
  modal?.show();
});

// Guardar
btnGuardar.addEventListener("click", async () => {
  const sol = solFromInputs();
  if (!sol.nombre || !sol.apP || !sol.curp || !sol.cendi || !sol.grupo_asignado) {
    return alert("Faltan obligatorios: Nombre, Apellido Paterno, CURP, CENDI, Grupo.");
  }

  const id = parseInt(sol_id.value || "0", 10);
  const r = id > 0 ? await api("update", { id, sol }) : await api("create", { sol });

  if (!r.ok) return alert(r.msg || "No se pudo guardar");

  modal?.hide();
  cargarLista();
});

// Edit/Delete
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  const id = parseInt(btn.getAttribute("data-id"), 10);

  if (action === "del") {
    if (!confirm("¿Eliminar esta solicitud?")) return;
    const r = await api("delete", { id });
    if (!r.ok) return alert(r.msg || "No se pudo eliminar");
    cargarLista();
  }

  if (action === "edit") {
    const r = await api("get", { id });
    if (!r.ok) return alert(r.msg || "No se pudo cargar");
    const it = r.item;

    sol_id.value = it.id;
    sol_nombre.value = it.nombre || "";
    sol_apP.value = it.apP || "";
    sol_apM.value = it.apM || "";
    sol_curp.value = it.curp || "";
    sol_cendi.value = it.cendi || "";
    sol_grupo.value = it.grupo_asignado || "";
    sol_trabajador.value = it.trabajador || "";
    sol_correo.value = it.correo_trabajador || "";

    modalTitle.textContent = `Editar solicitud #${it.id}`;
    modal?.show();
  }
});

// Auto-login
(async function boot() {
  const r = await api("me");
  if (r.ok) {
    mostrarPanel(r.usuario || "Admin");
    cargarLista();
  }
})();
