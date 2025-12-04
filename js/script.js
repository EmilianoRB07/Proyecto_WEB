const regex = {
    texto: /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/,
    curp: /^[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]{2}$/,
    telefono: /^\d{10}$/,
    cp: /^\d{5}$/,
    correoIPN: /^[a-z0-9._%+-]+@ipn\.mx$/,
    correoGmail: /^[a-z0-9._%+-]+@gmail\.com$/,
    password: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/
};

function validaCampo(id, pattern) {
    let input = document.getElementById(id);
    if (!input) return false;
    let valor = input.value.trim();
    let ok = pattern.test(valor);

    if (!ok) input.classList.add("is-invalid");
    else input.classList.remove("is-invalid");

    return ok;
}

function validaSelect(id) {
    let select = document.getElementById(id);
    if (!select) return false;
    let ok = select.value !== "";

    if (!ok) select.classList.add("is-invalid");
    else select.classList.remove("is-invalid");

    return ok;
}

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

function validarFormularioMenor() {
    let ok = true;

    if (!validaCampo("apP-m", regex.texto)) ok = false;
    if (!validaCampo("apM-m", regex.texto)) ok = false;
    if (!validaCampo("nombre-m", regex.texto)) ok = false;
    if (!validaSelect("genero-m")) ok = false;
    if (!validaCampo("LN-m", regex.texto)) ok = false;

    let fecha = document.getElementById("FN-m").value;
    if (fecha === "") {
        document.getElementById("FN-m").classList.add("is-invalid");
        ok = false;
    }

    if (!validaCampo("curp-m", regex.curp)) ok = false;
    if (!validaCampo("GS-m", regex.texto)) ok = false;
    if (!validaSelect("rh-m")) ok = false;

    if (!validaCampo("calle-m", regex.texto)) ok = false;
    if (!validaCampo("numero-m", /^[0-9A-Za-z]+$/)) ok = false;
    if (!validaCampo("colonia-m", regex.texto)) ok = false;

    if (!validaSelect("entidad-m")) ok = false;
    if (!validaSelect("alcaldia")) ok = false;

    let alc = document.getElementById("alcaldia").value;
    if (alc === "otro") {
        if (!validaCampo("municipio-otro", regex.texto)) ok = false;
    } else {
        document.getElementById("municipio-otro").classList.remove("is-invalid");
    }

    if (!validaCampo("cp-m", regex.cp)) ok = false;
    if (!validaCampo("telefono-m", regex.telefono)) ok = false;

    if (!validaSelect("grupo-m")) ok = false;
    if (!validaSelect("cendi-m")) ok = false;

    return ok;
}

function validarFormularioTrabajador() {
    let ok = true;

    if (!validaCampo("apP-t", regex.texto)) ok = false;
    if (!validaCampo("apM-t", regex.texto)) ok = false;
    if (!validaCampo("nombre-t", regex.texto)) ok = false;
    if (!validaCampo("LN-t", regex.texto)) ok = false;

    let fecha = document.getElementById("FN-t").value;
    if (fecha === "") {
        document.getElementById("FN-t").classList.add("is-invalid");
        ok = false;
    }

    if (!validaCampo("curp-t", regex.curp)) ok = false;
    if (!validaSelect("genero-t")) ok = false;
    if (!validaCampo("correo-i", regex.correoIPN)) ok = false;
    if (!validaCampo("correo-p", regex.correoGmail)) ok = false;
    if (!validaCampo("num_empleado", /^[0-9]{4,7}$/)) ok = false;

    if (!validaSelect("estado_civil")) ok = false;
    if (!validaSelect("ocupacion")) ok = false;
    if (!validaSelect("escolaridad")) ok = false;
    if (!validaSelect("adscripcion")) ok = false;
    if (!validaSelect("horario")) ok = false;

    return ok;
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

let icon = document.getElementById("togglePass");
if (icon) {
    icon.addEventListener("click", function () {
        let pass = document.getElementById("password-p");
        if (pass.type === "password") pass.type = "text";
        else pass.type = "password";
        icon.classList.toggle("bi-eye-slash-fill");
    });
}

let tips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tips.forEach(function (el) {
    new bootstrap.Tooltip(el);
});

let form = document.getElementById("formCompleto");

if (form) {

    let resetBtn = form.querySelector('button[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener("click", function (e) {
            e.preventDefault();
            form.reset();
            localStorage.clear();
            mostrarMenor();

            let alerta = document.getElementById("alerta-exito");
            if (alerta) alerta.classList.add("d-none");

            document.querySelectorAll(".is-invalid").forEach(x => {
                x.classList.remove("is-invalid");
            });
        });
    }

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

        guardarDatos();

        let contenido = `
            <h5>Revisa que todos los datos sean correctos:</h5>

            <h6>Datos del menor</h6>
            <ul>
                <li><strong>Nombre completo:</strong> ${document.getElementById("nombre-m").value} ${document.getElementById("apP-m").value} ${document.getElementById("apM-m").value}</li>
                <li><strong>Lugar de nacimiento:</strong> ${document.getElementById("LN-m").value}</li>
                <li><strong>Fecha de nacimiento:</strong> ${document.getElementById("FN-m").value}</li>
                <li><strong>CURP:</strong> ${document.getElementById("curp-m").value}</li>
                <li><strong>Género:</strong> ${document.getElementById("genero-m").value}</li>
                <li><strong>Grupo:</strong> ${document.getElementById("grupo-m").value}</li>
                <li><strong>Calle:</strong> ${document.getElementById("calle-m").value}</li>
                <li><strong>Número:</strong> ${document.getElementById("numero-m").value}</li>
                <li><strong>Colonia:</strong> ${document.getElementById("colonia-m").value}</li>
                <li><strong>Entidad:</strong> ${document.getElementById("entidad-m").value}</li>
                <li><strong>Municipio/Alcaldía:</strong> ${document.getElementById("alcaldia").value}</li>
                <li><strong>Código Postal:</strong> ${document.getElementById("cp-m").value}</li>
                <li><strong>Teléfono:</strong> ${document.getElementById("telefono-m").value}</li>
                <li><strong>Grupo Sanguíneo:</strong> ${document.getElementById("GS-m").value}</li>
                <li><strong>RH:</strong> ${document.getElementById("rh-m").value}</li>
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

        document.getElementById("contenidoModal").innerHTML = contenido;

        let modal = new bootstrap.Modal(document.getElementById("modalDatos"));
        modal.show();
    });

    document.getElementById("modalDatos").addEventListener("hidden.bs.modal", function () {
        document.getElementById("alerta-exito").classList.remove("d-none");
    });
}

window.onload = function () {
    cargarDatos();
    if (localStorage.getItem("formActual") === "trabajador") mostrarTrabajador();
};

document.addEventListener("input", guardarDatos);

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bienvenidaus");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = "bienvenida_usuario.html"; 
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginAdmin");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = "bienvenida_admin.html"; 
    });
});
