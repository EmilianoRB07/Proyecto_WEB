// ✅ IMPORTANTE: usa rutas ABSOLUTAS para que NO falle dependiendo desde dónde vengas
// Cambia "cendi" por el nombre real de tu carpeta en htdocs si es diferente.
const API_ACCESO = "./php/acceso.php";

// ===== Referencias =====
const formLogin = document.getElementById("formLogin");
const cardLogin = document.getElementById("cardLogin");
const panelDatos = document.getElementById("panelDatos");
const textoUsuario = document.getElementById("textoUsuario");
const listaMenores = document.getElementById("listaMenores");
const btnAcuse = document.getElementById("btnAcuse");
const btnCerrar = document.getElementById("btnCerrar");

// ===== Helpers =====
function setInvalid(el, msg = "") {
  if (!el) return;
  el.classList.add("is-invalid");
  if (msg) {
    const fb = el.parentElement?.querySelector(".invalid-feedback");
    if (fb) fb.textContent = msg;
  }
}
function clearInvalid(el) {
  if (!el) return;
  el.classList.remove("is-invalid");
}

function renderMenores(menores) {
  if (!listaMenores) return;

  if (!menores || menores.length === 0) {
    listaMenores.innerHTML = `
      <div class="alert alert-warning mb-0">
        No hay menores registrados para este usuario.
      </div>
    `;
    return;
  }

  let html = "";
  menores.forEach((m, i) => {
    html += `
      <div class="border rounded p-3 mb-3">
        <div class="d-flex justify-content-between flex-wrap gap-2">
          <h5 class="mb-0">Menor ${i + 1}</h5>
          <span class="badge bg-secondary">CURP: ${m.curp}</span>
        </div>

        <hr class="my-2">

        <div class="row g-2">
          <div class="col-md-6"><strong>Nombre:</strong> ${m.nombre} ${m.apP} ${m.apM}</div>
          <div class="col-md-6"><strong>Género:</strong> ${m.genero}</div>

          <div class="col-md-6"><strong>Fecha nac.:</strong> ${m.fecha_nac}</div>
          <div class="col-md-6"><strong>Grupo sanguíneo:</strong> ${m.grupo_sanguineo}</div>

          <div class="col-12"><strong>Dirección:</strong> ${m.calle} #${m.numero}, Col. ${m.colonia}, ${m.municipio}, ${m.entidad}, CP ${m.cp}</div>
          <div class="col-md-6"><strong>Teléfono:</strong> ${m.telefono}</div>

          <div class="col-md-6">
            <strong>CENDI:</strong>
            <span style="background:#ffe066; padding:2px 6px; border-radius:6px;">${m.cendi}</span>
          </div>

          <div class="col-md-6">
            <strong>Grupo asignado:</strong>
            <span style="background:#ffe066; padding:2px 6px; border-radius:6px;">${m.grupo_asignado}</span>
          </div>
        </div>
      </div>
    `;
  });

  listaMenores.innerHTML = html;
}

async function restaurarSesion() {
  try {
    const resp = await fetch(API_ACCESO, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ action: "status" })
    });

    const result = await resp.json();

    if (result.ok) {
      textoUsuario.textContent = `Sesión iniciada como: ${result.correo}`;
      renderMenores(result.menores);

      cardLogin.classList.add("d-none");
      panelDatos.classList.remove("d-none");
    } else {
      panelDatos.classList.add("d-none");
      cardLogin.classList.remove("d-none");
    }
  } catch (e) {
    console.warn("No se pudo restaurar sesión", e);
  }
}

// ✅ Todo lo que depende de bootstrap/DOM aquí adentro
document.addEventListener("DOMContentLoaded", () => {

  // Tooltips
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el);
  });

  // Toggle pass
  const toggle = document.getElementById("togglePass");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const input = document.getElementById("password-p");
      if (!input) return;
      input.type = (input.type === "password") ? "text" : "password";
      toggle.classList.toggle("bi-eye-slash-fill");
    });
  }

  // Restaurar sesión al cargar
  restaurarSesion();
});

// Back/forward cache
window.addEventListener("pageshow", restaurarSesion);

// Cuando vuelves a la pestaña
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) restaurarSesion();
});

// ===== Login AJAX =====
if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const correoEl = document.getElementById("correo-i");
    const passEl = document.getElementById("password-p");

    clearInvalid(correoEl);
    clearInvalid(passEl);

    const correo = (correoEl?.value || "").trim().toLowerCase();
    const pass = (passEl?.value || "");

    if (!correo) return setInvalid(correoEl, "Ingresa un correo válido.");
    if (!pass) return setInvalid(passEl, "Ingresa la contraseña.");

    try {
      const resp = await fetch(API_ACCESO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "login", correo, pass })
      });

      const result = await resp.json();
      if (!result.ok) return alert(result.msg || "No se pudo iniciar sesión");

      textoUsuario.textContent = `Sesión iniciada como: ${result.correo}`;
      renderMenores(result.menores);

      cardLogin.classList.add("d-none");
      panelDatos.classList.remove("d-none");

    } catch (err) {
      alert("Error de red / servidor");
    }
  });
}

// ===== Cerrar sesión =====
if (btnCerrar) {
  btnCerrar.addEventListener("click", async () => {
    try {
      await fetch(API_ACCESO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "logout" })
      });
    } catch (e) {}

    panelDatos.classList.add("d-none");
    cardLogin.classList.remove("d-none");
    formLogin?.reset();
    listaMenores.innerHTML = "";
    textoUsuario.textContent = "";
  });
}
