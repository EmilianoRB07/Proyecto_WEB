const regex = {
    texto: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/,
    curp: /^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]{2}$/,
    telefono: /^\d{10}$/,
    cp: /^\d{5}$/,
    correoIPN: /^[a-z0-9._%+-]+@ipn\.mx$/,
    correoGmail: /^[a-z0-9._%+-]+@gmail\.com$/,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/
};

function validaCampo(id, pattern) {
    const input = document.getElementById(id);
    const valido = pattern.test(input.value.trim());
    input.classList.toggle("is-invalid", !valido);
    return valido;
}

function validaSelect(id) {
    const sel = document.getElementById(id);
    const valido = sel.value !== "";
    sel.classList.toggle("is-invalid", !valido);
    return valido;
}

function guardarDatos() {
    const campos = document.querySelectorAll("input, select");
    let datos = {};
    campos.forEach(campo => datos[campo.id] = campo.value);
    localStorage.setItem("datosCENDI", JSON.stringify(datos));
}

function cargarDatos() {
    const datos = JSON.parse(localStorage.getItem("datosCENDI"));
    if (!datos) return;
    Object.keys(datos).forEach(id => {
        if (document.getElementById(id)) {
            document.getElementById(id).value = datos[id];
        }
    });
}

function validarFormularioMenor() {
    let valido = true;

    valido &&= validaCampo("apP-m", regex.texto);
    valido &&= validaCampo("apM-m", regex.texto);
    valido &&= validaCampo("nombre-m", regex.texto);
    valido &&= validaSelect("genero-m");
    valido &&= validaCampo("LN-m", regex.texto);
    valido &&= document.getElementById("FN-m").value !== "";
    valido &&= validaCampo("curp-m", regex.curp);
    valido &&= validaCampo("GS-m", regex.texto);
    valido &&= validaSelect("rh-m");
    valido &&= validaCampo("calle-m", regex.texto);
    valido &&= validaCampo("numero-m", /^[0-9A-Za-z]+$/);
    valido &&= validaCampo("colonia-m", regex.texto);
    valido &&= validaSelect("entidad-m");
    valido &&= validaSelect("alcaldia");

    if (document.getElementById("alcaldia").value === "otro") {
        valido &&= validaCampo("municipio-otro", regex.texto);
    }

    valido &&= validaCampo("cp-m", regex.cp);
    valido &&= validaCampo("telefono-m", regex.telefono);
    valido &&= validaSelect("grupo-m");

    return !!valido;
}

function validarFormularioTrabajador() {
    let valido = true;

    valido &&= validaCampo("apP-t", regex.texto);
    valido &&= validaCampo("apM-t", regex.texto);
    valido &&= validaCampo("nombre-t", regex.texto);
    valido &&= validaCampo("LN-t", regex.texto);
    valido &&= document.getElementById("FN-t").value !== "";
    valido &&= validaCampo("curp-t", regex.curp);
    valido &&= validaSelect("genero-t");
    valido &&= validaCampo("correo-i", regex.correoIPN);
    valido &&= validaCampo("correo-p", regex.correoGmail);
    valido &&= validaCampo("password-p", regex.password);
    valido &&= validaCampo("num_empleado", /^[0-9]{1,10}$/);
    valido &&= validaSelect("estado_civil");
    valido &&= validaSelect("ocupacion");
    valido &&= validaSelect("escolaridad");
    valido &&= validaSelect("adscripcion");
    valido &&= validaSelect("horario");

    return !!valido;
}

function mostrarTrabajador() {
    if (!validarFormularioMenor()) {
        alert("Por favor corrige los campos del menor antes de continuar.");
        return;
    }
    document.getElementById("formMenor").style.display = "none";
    document.getElementById("formTrabajador").style.display = "block";
    localStorage.setItem("formActual", "trabajador");
    guardarDatos();
}

function mostrarMenor() {
    document.getElementById("formTrabajador").style.display = "none";
    document.getElementById("formMenor").style.display = "block";
    localStorage.setItem("formActual", "menor");
    cargarDatos();
}

const toggleIcon = document.getElementById("togglePass");
toggleIcon.addEventListener("click", () => {
    const pass = document.getElementById("password-p");
    pass.type = pass.type === "password" ? "text" : "password";
    toggleIcon.classList.toggle("bi-eye-slash-fill");
});

const form = document.getElementById("formCompleto");
const resetBtn = form.querySelector('button[type="reset"]');

resetBtn.addEventListener("click", e => {
    e.preventDefault();
    form.reset();
    localStorage.removeItem("datosCENDI");
    localStorage.removeItem("formActual");
    document.getElementById("formTrabajador").style.display = "none";
    document.getElementById("formMenor").style.display = "block";
    const alerta = document.getElementById("alerta-exito");
    if (alerta) alerta.classList.add("d-none");
    document.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
});

form.addEventListener("submit", e => {
    e.preventDefault();

    if (!validarFormularioMenor()) {
        mostrarMenor();
        alert("Corrige los datos del menor.");
        return;
    }

    if (!validarFormularioTrabajador()) {
        mostrarTrabajador();
        return;
    }

    guardarDatos();

    const contenido = `
    <h5> Hola ${document.getElementById("nombre-t").value}, verifica que los datos que ingresaste sean correctos:</h5>
      <h6>Datos del menor</h6>
      <ul>
        <li><strong>Nombre:</strong> ${document.getElementById("nombre-m").value}</li>
        <li><strong>Apellidos:</strong> ${document.getElementById("apP-m").value} ${document.getElementById("apM-m").value}</li>
        <li><strong>CURP:</strong> ${document.getElementById("curp-m").value}</li>
        <li><strong>Género:</strong> ${document.getElementById("genero-m").value}</li>
        <li><strong>Fecha nacimiento:</strong> ${document.getElementById("FN-m").value}</li>
      </ul>

      <h6 class="mt-3">Datos del trabajador</h6>
      <ul>
        <li><strong>Nombre:</strong> ${document.getElementById("nombre-t").value}</li>
        <li><strong>Apellidos:</strong> ${document.getElementById("apP-t").value} ${document.getElementById("apM-t").value}</li>
        <li><strong>CURP:</strong> ${document.getElementById("curp-t").value}</li>
        <li><strong>Correo institucional:</strong> ${document.getElementById("correo-i").value}</li>
        <li><strong>Género:</strong> ${document.getElementById("genero-t").value}</li>
        <li><strong>Número de empleado:</strong> ${document.getElementById("num_empleado").value}</li>
      </ul>
    `;

    document.getElementById("contenidoModal").innerHTML = contenido;
    new bootstrap.Modal(document.getElementById("modalDatos")).show();
});

document.getElementById("modalDatos").addEventListener("hidden.bs.modal", () => {
    document.getElementById("alerta-exito").classList.remove("d-none");
});

window.onload = () => {
    cargarDatos();
    if (localStorage.getItem("formActual") === "trabajador") {
        mostrarTrabajador();
    }
};

document.addEventListener("input", guardarDatos);
