// ===================== REGEX =====================
const regex = {
  texto: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/,
  curp: /^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]{2}$/,
  telefono: /^\d{10}$/,
  cp: /^\d{5}$/
};

// ===================== VALIDACIONES =====================
function validaCampo(id, pattern) {
  const input = document.getElementById(id);
  if (!input) return true;
  const valor = input.value.trim();
  const ok = pattern ? pattern.test(valor) : (valor !== "");
  input.classList.toggle("is-invalid", !ok);
  return ok;
}

function validaSelect(id) {
  const select = document.getElementById(id);
  if (!select) return true;
  const ok = select.value !== "";
  select.classList.toggle("is-invalid", !ok);
  return ok;
}

function getMunicipioFinal() {
  const alc = document.getElementById("alcaldia");
  if (!alc) return "";
  if (alc.value === "otro") return (document.getElementById("municipio-otro")?.value || "").trim();
  return alc.value;
}

function validarFormularioMenor() {
  let ok = true;

  if (!validaCampo("apP-m", regex.texto)) ok = false;
  if (!validaCampo("apM-m", regex.texto)) ok = false;
  if (!validaCampo("nombre-m", regex.texto)) ok = false;
  if (!validaSelect("genero-m")) ok = false;
  if (!validaCampo("LN-m", regex.texto)) ok = false;

  const FN = document.getElementById("FN-m");
  if (FN) {
    const good = FN.value !== "";
    FN.classList.toggle("is-invalid", !good);
    if (!good) ok = false;
  }

  if (!validaCampo("curp-m", regex.curp)) ok = false;
  if (!validaSelect("GS-m")) ok = false;

  if (!validaCampo("calle-m", regex.texto)) ok = false;
  if (!validaCampo("numero-m", /^[0-9A-Za-z]+$/)) ok = false;
  if (!validaCampo("colonia-m", regex.texto)) ok = false;

  if (!validaSelect("entidad-m")) ok = false;
  if (!validaSelect("alcaldia")) ok = false;

  const alc = document.getElementById("alcaldia");
  if (alc && alc.value === "otro") {
    if (!validaCampo("municipio-otro", regex.texto)) ok = false;
  }

  if (!validaCampo("cp-m", regex.cp)) ok = false;
  if (!validaCampo("telefono-m", regex.telefono)) ok = false;

  // grupo asignado (hidden)
  const grupoHidden = document.getElementById("grupo-m");
  const grupoTexto = document.getElementById("grupo-m-texto");
  if (grupoHidden && grupoTexto) {
    const good = grupoHidden.value.trim() !== "";
    grupoTexto.classList.toggle("is-invalid", !good);
    if (!good) ok = false;
  }

  if (!validaSelect("cendi-m")) ok = false;

  return ok;
}

// ===================== GRUPO AUTOMÁTICO =====================
const fechaMenor = document.getElementById("FN-m");
const grupoTexto = document.getElementById("grupo-m-texto");
const grupoHidden = document.getElementById("grupo-m");

function entreMeses(nacimiento, hoy) {
  let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
  if (hoy.getDate() < nacimiento.getDate()) meses--;
  return meses;
}

function asignarGrupo() {
  if (!fechaMenor || !grupoTexto || !grupoHidden) return;

  const val = fechaMenor.value;
  if (!val) {
    grupoTexto.value = "Asignado automáticamente";
    grupoHidden.value = "";
    return;
  }

  const nac = new Date(val + "T00:00:00");
  const hoy = new Date();
  const meses = entreMeses(nac, hoy);

  let texto = "";

  if (meses >= 0 && meses <= 12) texto = "Lactantes I - II (0-12 meses)";
  else if (meses >= 13 && meses <= 24) texto = "Maternal I (1 año 1 día - 2 años)";
  else if (meses >= 25 && meses <= 36) texto = "Maternal II (2 años 1 día - 3 años)";
  else if (meses >= 37 && meses <= 48) texto = "Preescolar I (3 años 1 día - 4 años)";
  else if (meses >= 49 && meses <= 60) texto = "Preescolar II (4 años 1 día - 5 años)";
  else if (meses >= 61 && meses <= 72) texto = "Preescolar III (5 años 1 día - 6 años)";
  else {
    grupoTexto.value = "Fuera del límite de edad";
    grupoHidden.value = "";
    return;
  }

  grupoTexto.value = texto;
  grupoHidden.value = texto;
}

if (fechaMenor) fechaMenor.addEventListener("input", asignarGrupo);
window.addEventListener("load", asignarGrupo);

// ===================== MUNICIPIO OTRO (si lo mantienes) =====================
(function initMunicipioOtro() {
  const selectAlcaldia = document.getElementById("alcaldia");
  const campoOtro = document.getElementById("municipio-otro-container");
  const inputOtro = document.getElementById("municipio-otro");
  if (!selectAlcaldia || !campoOtro || !inputOtro) return;

  selectAlcaldia.addEventListener("change", () => {
    if (selectAlcaldia.value === "otro") {
      campoOtro.style.display = "block";
      inputOtro.setAttribute("required", "true");
    } else {
      campoOtro.style.display = "none";
      inputOtro.removeAttribute("required");
      inputOtro.value = "";
      inputOtro.classList.remove("is-invalid");
    }
  });
})();

// ===================== MODAL RESUMEN =====================
function payloadMenor() {
  return {
    apP: document.getElementById("apP-m").value.trim(),
    apM: document.getElementById("apM-m").value.trim(),
    nombre: document.getElementById("nombre-m").value.trim(),
    genero: document.getElementById("genero-m").value,
    lugar_nac: document.getElementById("LN-m").value.trim(),
    fecha_nac: document.getElementById("FN-m").value,
    curp: document.getElementById("curp-m").value.trim().toUpperCase(),
    grupo_sanguineo: document.getElementById("GS-m").value,
    calle: document.getElementById("calle-m").value.trim(),
    numero: document.getElementById("numero-m").value.trim(),
    colonia: document.getElementById("colonia-m").value.trim(),
    entidad: document.getElementById("entidad-m").value,
    municipio: getMunicipioFinal(),
    cp: document.getElementById("cp-m").value.trim(),
    telefono: document.getElementById("telefono-m").value.trim(),
    grupo_asignado: document.getElementById("grupo-m").value.trim(),
    cendi: document.getElementById("cendi-m").value
  };
}

function llenarModalMenor(m) {
  const cont = document.getElementById("contenidoModal");
  if (!cont) return;

  cont.innerHTML = `
    <h5>Verifica los datos del menor:</h5>
    <ul>
      <li><strong>Nombre:</strong> ${m.nombre} ${m.apP} ${m.apM}</li>
      <li><strong>Género:</strong> ${m.genero}</li>
      <li><strong>Lugar nac.:</strong> ${m.lugar_nac}</li>
      <li><strong>Fecha nac.:</strong> ${m.fecha_nac}</li>
      <li><strong>CURP:</strong> ${m.curp}</li>
      <li><strong>Grupo sanguíneo:</strong> ${m.grupo_sanguineo}</li>
      <li><strong>Dirección:</strong> ${m.calle} #${m.numero}, Col. ${m.colonia}, ${m.municipio}, ${m.entidad}, CP ${m.cp}</li>
      <li><strong>Teléfono:</strong> ${m.telefono}</li>
      <li><strong>CENDI:</strong> ${m.cendi}</li>
      <li><strong>Grupo asignado:</strong> <span style="background:#ffe066; padding:2px 6px; border-radius:6px;">${m.grupo_asignado}</span></li>
    </ul>
  `;
}

// ===================== SUBMIT (ABRE MODAL) =====================
const form = document.getElementById("formMenorSolo"); // ponle este id al form de nuevo_menor.html
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    asignarGrupo(); // asegura hidden actualizado

    if (!validarFormularioMenor()) return;

    const m = payloadMenor();
    llenarModalMenor(m);

    const modalEl = document.getElementById("modalDatos");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  });
}

// ===================== CONFIRMAR (AJAX) =====================
document.addEventListener("click", async (e) => {
  if (!e.target || e.target.id !== "btnConfirmarRegistro") return;

  const m = payloadMenor();

  try {
    const resp = await fetch("php/nuevo_menor_api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin", // IMPORTANTÍSIMO para sesión
      body: JSON.stringify({ menor: m })
    });

    // Si el server devuelve HTML por error, esto truena; por eso lo protegemos:
    const text = await resp.text();
    let result;
    try { result = JSON.parse(text); } 
    catch { throw new Error("Respuesta no es JSON: " + text.slice(0, 120)); }

    if (!resp.ok || !result.ok) {
      alert(result.msg || "No se pudo guardar");
      return;
    }

    alert("¡Menor agregado! Regresando a Acceso...");
    window.location.href = "acceso.html";
  } catch (err) {
    console.error(err);
    alert("Error de red / servidor (revisa ruta y PHP)");
  }
});
