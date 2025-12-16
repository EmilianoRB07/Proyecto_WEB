// ===================== REGEX =====================
const regex = {
  texto: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/,
  curp: /^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]{2}$/,
  telefono: /^\d{10}$/,
  cp: /^\d{5}$/,
  correoIPN: /^[a-z0-9._%+-]+@ipn\.mx$/,
  correoGmail: /^[a-z0-9._%+-]+@gmail\.com$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/
};

// ===================== VALIDACIONES BÁSICAS =====================
function validaCampo(id, pattern) {
  let input = document.getElementById(id);
  if (!input) return true; // si no existe en esta página, no falla
  let valor = input.value.trim();

  // si no te pasan patrón, solo valida que no esté vacío
  let ok = pattern ? pattern.test(valor) : (valor !== "");

  if (!ok) input.classList.add("is-invalid");
  else input.classList.remove("is-invalid");

  return ok;
}

function validaSelect(id) {
  let select = document.getElementById(id);
  if (!select) return true;
  let ok = select.value !== "";

  if (!ok) select.classList.add("is-invalid");
  else select.classList.remove("is-invalid");

  return ok;
}

// ===================== LOCALSTORAGE (OPCIONAL) =====================
function guardarDatos() {
  let elementos = document.querySelectorAll("input, select");
  let datos = {};
  elementos.forEach(el => {
    if (el.id) datos[el.id] = el.value;
  });
  localStorage.setItem("datosCENDI", JSON.stringify(datos));
}

function cargarDatos() {
  let guardados = localStorage.getItem("datosCENDI");
  if (!guardados) return;

  let datos = JSON.parse(guardados);
  for (let id in datos) {
    let campo = document.getElementById(id);
    if (campo) campo.value = datos[id];
  }
}

// ===================== VALIDAR FORM MENOR =====================
function validarFormularioMenor() {
  let ok = true;

  if (!validaCampo("apP-m", regex.texto)) ok = false;
  if (!validaCampo("apM-m", regex.texto)) ok = false;
  if (!validaCampo("nombre-m", regex.texto)) ok = false;
  if (!validaSelect("genero-m")) ok = false;
  if (!validaCampo("LN-m", regex.texto)) ok = false;

  let FN = document.getElementById("FN-m");
  if (FN) {
    if (FN.value === "") {
      FN.classList.add("is-invalid");
      ok = false;
    } else {
      FN.classList.remove("is-invalid");
    }
  }

  if (!validaCampo("curp-m", regex.curp)) ok = false;
  if (!validaSelect("GS-m")) ok = false;

  if (!validaCampo("calle-m", regex.texto)) ok = false;
  if (!validaCampo("numero-m", /^[0-9A-Za-z]+$/)) ok = false;
  if (!validaCampo("colonia-m", regex.texto)) ok = false;

  if (!validaSelect("entidad-m")) ok = false;
  if (!validaSelect("alcaldia")) ok = false;

  let alcaldia = document.getElementById("alcaldia");
  if (alcaldia && alcaldia.value === "otro") {
    if (!validaCampo("municipio-otro", regex.texto)) ok = false;
  } else {
    let m = document.getElementById("municipio-otro");
    if (m) m.classList.remove("is-invalid");
  }

  if (!validaCampo("cp-m", regex.cp)) ok = false;
  if (!validaCampo("telefono-m", regex.telefono)) ok = false;

  // grupo asignado (hidden)
  let grupoHidden = document.getElementById("grupo-m");
  let grupoTexto = document.getElementById("grupo-m-texto");
  if (grupoHidden && grupoTexto) {
    if (grupoHidden.value.trim() === "") {
      grupoTexto.classList.add("is-invalid");
      ok = false;
    } else {
      grupoTexto.classList.remove("is-invalid");
    }
  }

  if (!validaSelect("cendi-m")) ok = false;

  return ok;
}

// ===================== VALIDAR FORM TRABAJADOR =====================
function validarFormularioTrabajador() {
  let ok = true;

  if (!validaCampo("apP-t", regex.texto)) ok = false;
  if (!validaCampo("apM-t", regex.texto)) ok = false;
  if (!validaCampo("nombre-t", regex.texto)) ok = false;
  if (!validaCampo("LN-t", regex.texto)) ok = false;

  let FN = document.getElementById("FN-t");
  if (FN) {
    if (FN.value === "") {
      FN.classList.add("is-invalid");
      ok = false;
    } else {
      FN.classList.remove("is-invalid");
    }
  }

  if (!validaCampo("curp-t", regex.curp)) ok = false;
  if (!validaSelect("genero-t")) ok = false;
  if (!validaCampo("correo-i", regex.correoIPN)) ok = false;

  // contraseña (en tu inscripcion es id="password-p")
  if (!validaCampo("password-p", regex.password)) ok = false;

  if (!validaCampo("correo-p", regex.correoGmail)) ok = false;
  if (!validaCampo("num_empleado", /^[0-9]{4,7}$/)) ok = false;

  if (!validaSelect("estado_civil")) ok = false;
  if (!validaSelect("ocupacion")) ok = false;
  if (!validaSelect("escolaridad")) ok = false;
  if (!validaSelect("adscripcion")) ok = false;
  if (!validaSelect("horario")) ok = false;

  return ok;
}

// ===================== CAMBIAR FORMULARIOS =====================
function mostrarTrabajador() {
  if (!validarFormularioMenor()) {
    alert("Por favor corrige los campos del menor antes de continuar.");
    return;
  }

  let fm = document.getElementById("formMenor");
  let ft = document.getElementById("formTrabajador");
  if (fm) fm.style.display = "none";
  if (ft) ft.style.display = "block";

  localStorage.setItem("formActual", "trabajador");
  guardarDatos();
}

function mostrarMenor() {
  let ft = document.getElementById("formTrabajador");
  let fm = document.getElementById("formMenor");
  if (ft) ft.style.display = "none";
  if (fm) fm.style.display = "block";

  localStorage.setItem("formActual", "menor");
  cargarDatos();
}

// ===================== TOOLTIP + OJO CONTRASEÑA =====================
(function initUI() {
  // tooltips
  let tips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tips.forEach(function (el) {
    if (typeof bootstrap !== "undefined") new bootstrap.Tooltip(el);
  });

  // ojito (solo si existe)
  let icon = document.getElementById("togglePass");
  if (icon) {
    icon.addEventListener("click", function () {
      let pass = document.getElementById("password-p");
      if (!pass) return;
      pass.type = (pass.type === "password") ? "text" : "password";
      icon.classList.toggle("bi-eye-slash-fill");
    });
  }
})();

// ===================== ASIGNAR GRUPO AUTOMÁTICO =====================
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

// ===================== MUNICIPIO "OTRO" =====================
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

// ===================== MODAL "VERIFICAR DATOS" =====================
function getMunicipioFinal() {
  const alc = document.getElementById("alcaldia");
  if (!alc) return "";
  if (alc.value === "otro") return (document.getElementById("municipio-otro")?.value || "").trim();
  return alc.value;
}

function buildPayload() {
  return {
    menor: {
      apP: document.getElementById("apP-m")?.value.trim() || "",
      apM: document.getElementById("apM-m")?.value.trim() || "",
      nombre: document.getElementById("nombre-m")?.value.trim() || "",
      genero: document.getElementById("genero-m")?.value || "",
      lugar_nacimiento: document.getElementById("LN-m")?.value.trim() || "",
      fecha_nacimiento: document.getElementById("FN-m")?.value || "",
      curp: (document.getElementById("curp-m")?.value || "").trim().toUpperCase(),
      grupo_sanguineo: document.getElementById("GS-m")?.value || "",
      calle: document.getElementById("calle-m")?.value.trim() || "",
      numero: document.getElementById("numero-m")?.value.trim() || "",
      colonia: document.getElementById("colonia-m")?.value.trim() || "",
      entidad: document.getElementById("entidad-m")?.value || "",
      municipio: getMunicipioFinal(),
      cp: document.getElementById("cp-m")?.value.trim() || "",
      telefono: document.getElementById("telefono-m")?.value.trim() || "",
      grupo_asignado: document.getElementById("grupo-m")?.value.trim() || "",
      cendi: document.getElementById("cendi-m")?.value || ""
    },
    trabajador: {
      apP: document.getElementById("apP-t")?.value.trim() || "",
      apM: document.getElementById("apM-t")?.value.trim() || "",
      nombre: document.getElementById("nombre-t")?.value.trim() || "",
      lugar_nacimiento: document.getElementById("LN-t")?.value.trim() || "",
      fecha_nacimiento: document.getElementById("FN-t")?.value || "",
      curp: (document.getElementById("curp-t")?.value || "").trim().toUpperCase(),
      genero: document.getElementById("genero-t")?.value || "",
      correo_institucional: (document.getElementById("correo-i")?.value || "").trim().toLowerCase(),
      password: document.getElementById("password-p")?.value || "",
      correo_personal: (document.getElementById("correo-p")?.value || "").trim().toLowerCase(),
      num_empleado: document.getElementById("num_empleado")?.value.trim() || "",
      estado_civil: document.getElementById("estado_civil")?.value || "",
      ocupacion: document.getElementById("ocupacion")?.value || "",
      escolaridad: document.getElementById("escolaridad")?.value || "",
      adscripcion: document.getElementById("adscripcion")?.value || "",
      horario: document.getElementById("horario")?.value || ""
    }
  };
}

function llenarModal() {
  const municipioFinal = getMunicipioFinal();

  let contenido = `
    <h5>Revisa que todos los datos sean correctos:</h5>

    <h6>Datos del menor</h6>
    <ul>
      <li><strong>Nombre completo:</strong> ${document.getElementById("nombre-m").value} ${document.getElementById("apP-m").value} ${document.getElementById("apM-m").value}</li>
      <li><strong>Lugar de nacimiento:</strong> ${document.getElementById("LN-m").value}</li>
      <li><strong>Fecha de nacimiento:</strong> ${document.getElementById("FN-m").value}</li>
      <li><strong>CURP:</strong> ${document.getElementById("curp-m").value}</li>
      <li><strong>Género:</strong> ${document.getElementById("genero-m").value}</li>
      <li><strong>Grupo:</strong> ${document.getElementById("grupo-m-texto").value}</li>
      <li><strong>Calle:</strong> ${document.getElementById("calle-m").value}</li>
      <li><strong>Número:</strong> ${document.getElementById("numero-m").value}</li>
      <li><strong>Colonia:</strong> ${document.getElementById("colonia-m").value}</li>
      <li><strong>Entidad:</strong> ${document.getElementById("entidad-m").value}</li>
      <li><strong>Municipio/Alcaldía:</strong> ${municipioFinal}</li>
      <li><strong>Código Postal:</strong> ${document.getElementById("cp-m").value}</li>
      <li><strong>Teléfono:</strong> ${document.getElementById("telefono-m").value}</li>
      <li><strong>Grupo Sanguíneo:</strong> ${document.getElementById("GS-m").value}</li>
      <li><strong>CENDI:</strong> ${document.getElementById("cendi-m").value}</li>
    </ul>

    <h6 class="mt-3">Datos del trabajador</h6>
    <ul>
      <li><strong>Nombre completo:</strong> ${document.getElementById("nombre-t").value} ${document.getElementById("apP-t").value} ${document.getElementById("apM-t").value}</li>
      <li><strong>Lugar de nacimiento:</strong> ${document.getElementById("LN-t").value}</li>
      <li><strong>Fecha de nacimiento:</strong> ${document.getElementById("FN-t").value}</li>
      <li><strong>CURP:</strong> ${document.getElementById("curp-t").value}</li>
      <li><strong>Género:</strong> ${document.getElementById("genero-t").value}</li>
      <li><strong>Correo institucional:</strong> ${document.getElementById("correo-i").value}</li>
      <li><strong>Correo personal:</strong> ${document.getElementById("correo-p").value}</li>
      <li><strong>Número de empleado:</strong> ${document.getElementById("num_empleado").value}</li>
      <li><strong>Estado civil:</strong> ${document.getElementById("estado_civil").value}</li>
      <li><strong>Ocupación:</strong> ${document.getElementById("ocupacion").value}</li>
      <li><strong>Escolaridad:</strong> ${document.getElementById("escolaridad").value}</li>
      <li><strong>Adscripción:</strong> ${document.getElementById("adscripcion").value}</li>
      <li><strong>Horario:</strong> ${document.getElementById("horario").value}</li>
    </ul>
  `;

  const cont = document.getElementById("contenidoModal");
  if (cont) cont.innerHTML = contenido;
}

// ===================== FORM INSCRIPCIÓN =====================
let form = document.getElementById("formCompleto");
if (form) {

  // restaurar datos
  window.addEventListener("load", () => {
    cargarDatos();
    if (localStorage.getItem("formActual") === "trabajador") mostrarTrabajador();
  });

  // guardar al escribir
  document.addEventListener("input", () => {
    // solo guarda si existe el form (o sea, estás en inscripción)
    if (document.getElementById("formCompleto")) guardarDatos();
  });

  // reset
  let resetBtn = form.querySelector('button[type="reset"]');
  if (resetBtn) {
    resetBtn.addEventListener("click", function (e) {
      e.preventDefault();
      form.reset();
      localStorage.clear();
      mostrarMenor();

      let alerta = document.getElementById("alerta-exito");
      if (alerta) alerta.classList.add("d-none");

      document.querySelectorAll(".is-invalid").forEach(x => x.classList.remove("is-invalid"));
      asignarGrupo();
    });
  }

  // submit = SOLO abrir modal
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validarFormularioMenor()) {
      mostrarMenor();
      return;
    }

    if (!validarFormularioTrabajador()) {
      mostrarTrabajador();
      return;
    }

    llenarModal();

    let modal = new bootstrap.Modal(document.getElementById("modalDatos"));
    modal.show();
  });

  // click confirmar = AQUÍ VA EL AJAX
document.addEventListener("click", async (e) => {
  if (!e.target || e.target.id !== "btnConfirmarRegistro") return;

  // arma municipio (si puso "otro")
  const municipio =
    (document.getElementById("alcaldia").value === "otro")
      ? document.getElementById("municipio-otro").value.trim()
      : document.getElementById("alcaldia").value;

  const payload = {
    menor: {
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
      municipio: municipio,
      cp: document.getElementById("cp-m").value.trim(),
      telefono: document.getElementById("telefono-m").value.trim(),
      grupo_asignado: document.getElementById("grupo-m").value,
      cendi: document.getElementById("cendi-m").value
    },
    trabajador: {
      apP: document.getElementById("apP-t").value.trim(),
      apM: document.getElementById("apM-t").value.trim(),
      nombre: document.getElementById("nombre-t").value.trim(),
      lugar_nac: document.getElementById("LN-t").value.trim(),
      fecha_nac: document.getElementById("FN-t").value,
      curp: document.getElementById("curp-t").value.trim().toUpperCase(),
      genero: document.getElementById("genero-t").value,
      correo_inst: document.getElementById("correo-i").value.trim(),
      pass: document.getElementById("password-p").value,
      correo_personal: document.getElementById("correo-p").value.trim(),
      estado_civil: document.getElementById("estado_civil").value,
      ocupacion: document.getElementById("ocupacion").value,
      num_empleado: document.getElementById("num_empleado").value.trim(),
      escolaridad: document.getElementById("escolaridad").value,
      adscripcion: document.getElementById("adscripcion").value,
      horario: document.getElementById("horario").value
    }
  };

  try {
    const resp = await fetch("./php/inscripcion.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await resp.json();

    if (!result.ok) {
      alert(result.msg || "No se pudo guardar");
      return;
    }

    alert("¡Registro guardado! Ahora inicia sesión.");
    window.location.href = "acceso.html";
  } catch (err) {
    alert("Error de red / servidor");
  }
});
}
