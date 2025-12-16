// ===== Tooltips (por si los usas) =====
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
  new bootstrap.Tooltip(el);
});

// ===== Mostrar / ocultar contraseña =====
const toggle = document.getElementById("togglePass");
if (toggle) {
  toggle.addEventListener("click", () => {
    const input = document.getElementById("password-p");
    if (!input) return;
    input.type = (input.type === "password") ? "text" : "password";
    toggle.classList.toggle("bi-eye-slash-fill");
  });
}

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
            <span style="background: #ffe066; padding: 2px 6px; border-radius: 6px;">
              ${m.cendi}
            </span>
          </div>

          <div class="col-md-6">
            <strong>Grupo asignado:</strong>
            <span style="background: #ffe066; padding: 2px 6px; border-radius: 6px;">
              ${m.grupo_asignado}
            </span>
          </div>
        </div>
      </div>
    `;
  });

  listaMenores.innerHTML = html;
}

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

    if (!correo) {
      setInvalid(correoEl, "Ingresa un correo válido.");
      return;
    }
    if (!pass) {
      setInvalid(passEl, "Ingresa la contraseña.");
      return;
    }

    try {
      const resp = await fetch("./php/acceso.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          correo,
          pass
        })
      });

      const result = await resp.json();

      if (!result.ok) {
        alert(result.msg || "No se pudo iniciar sesión");
        return;
      }

      // UI
      textoUsuario.textContent = `Sesión iniciada como: ${result.correo}`;
      renderMenores(result.menores);

      cardLogin.classList.add("d-none");
      panelDatos.classList.remove("d-none");

    } catch (err) {
      alert("Error de red / servidor");
    }
  });
}

// ===== Generar PDF (Acuse) =====
if (btnAcuse) {
  btnAcuse.addEventListener("click", () => {
    const area = document.getElementById("areaAcuse");
    if (!area) return;

    const opt = {
      margin: 10,
      filename: "acuse_cendi.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(area).save();
  });
}

// ===== Cerrar sesión =====
if (btnCerrar) {
  btnCerrar.addEventListener("click", async () => {
    try {
      await fetch("./php/acceso.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" })
      });
    } catch (e) {}

    // UI reset
    panelDatos.classList.add("d-none");
    cardLogin.classList.remove("d-none");
    formLogin?.reset();
    listaMenores.innerHTML = "";
    textoUsuario.textContent = "";
  });
}
