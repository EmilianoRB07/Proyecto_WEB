<?php
session_set_cookie_params([
  "lifetime" => 0,
  "path" => "/",        
  "httponly" => true,
  "samesite" => "Lax"
]);
session_start();

if (!isset($_SESSION["trabajador_id"])) {
  header("Location: acceso.html");
  exit;
}
?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CENDI - Agregar Menor</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <link href="css/estilos.css" rel="stylesheet">
    <link rel="icon" href="img/logo_tiburon_mamado-removebg-preview.png" type="image/png">
</head>

<body>
    <header>
        <nav class="navbar navbar-expand-lg navbar-dark bg-guinda shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="index.html">
                    <img src="img/ipnblack.png" alt="IPN">
                </a>

                <div class="collapse navbar-collapse show">
                    <ul class="navbar-nav ms-auto align-items-center flex-row gap-3">
                        <li class="nav-item">
                            <a class="nav-link" href="acceso.html">
                                <i class="bi bi-arrow-left-circle me-1"></i>Regresar
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <main class="container my-5">
        <div class="row justify-content-center">
            <div class="col-lg-9">

                <div class="card card-registro p-4">
                    <h2 class="text-center mb-4">Registro de Nuevo Menor</h2>

                    <form id="formMenorSolo" novalidate>
                        <h5 class="mb-3">Datos del menor</h5>

                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Apellido paterno</label>
                                <input type="text" id="apP-m" class="form-control" required>
                                <div class="invalid-feedback">Campo obligatorio</div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Apellido materno</label>
                                <input type="text" id="apM-m" class="form-control" required>
                                <div class="invalid-feedback">Campo obligatorio</div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Nombre(s)</label>
                                <input type="text" id="nombre-m" class="form-control" required>
                                <div class="invalid-feedback">Campo obligatorio</div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Género</label>
                                <select id="genero-m" class="form-select" required>
                                    <option value="">Selecciona</option>
                                    <option>Femenino</option>
                                    <option>Masculino</option>
                                </select>
                                <div class="invalid-feedback">Selecciona una opción</div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Lugar de nacimiento</label>
                                <input type="text" id="LN-m" class="form-control" required>
                                <div class="invalid-feedback">Campo obligatorio</div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Fecha de nacimiento</label>
                                <input type="date" id="FN-m" class="form-control" required>
                                <div class="invalid-feedback">Campo obligatorio</div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">CURP</label>
                                <input type="text" id="curp-m" class="form-control" maxlength="18" required>
                                <div class="invalid-feedback">CURP inválida</div>
                            </div>

                            <div class="col-md-4">
                                <label class="form-label">Grupo sanguíneo</label>
                                <select id="GS-m" class="form-select" required>
                                    <option value="">Selecciona</option>
                                    <option>O+</option>
                                    <option>O-</option>
                                    <option>A+</option>
                                    <option>A-</option>
                                    <option>B+</option>
                                    <option>B-</option>
                                    <option>AB+</option>
                                    <option>AB-</option>
                                </select>
                                <div class="invalid-feedback">Selecciona una opción</div>
                            </div>
                        </div>

                        <hr class="my-4">
                        <h5 class="mb-3">Dirección</h5>

                        <div class="row g-3">
                            <div class="col-md-4">
                                <label class="form-label">Calle</label>
                                <input type="text" id="calle-m" class="form-control" required>
                            </div>

                            <div class="col-md-2">
                                <label class="form-label">Número</label>
                                <input type="text" id="numero-m" class="form-control" required>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Colonia</label>
                                <input type="text" id="colonia-m" class="form-control" required>
                            </div>

                            <div class="col-md-3">
                                <label class="form-label">Entidad</label>
                                <select id="entidad-m" class="form-select" required>
                                    <option value="">Selecciona</option>
                                    <option>Aguascalientes</option>
                                    <option>Baja California</option>
                                    <option>Baja California Sur</option>
                                    <option>Campeche</option>
                                    <option>CDMX</option>
                                    <option>Chiapas</option>
                                    <option>Chihuahua</option>
                                    <option>Coahuila</option>
                                    <option>Colima</option>
                                    <option>Durango</option>
                                    <option>Guanajuato</option>
                                    <option>Guerrero</option>
                                    <option>Hidalgo</option>
                                    <option>Jalisco</option>
                                    <option>Estado de México</option>
                                    <option>Michoacán</option>
                                    <option>Morelos</option>
                                    <option>Nayarit</option>
                                    <option>Nuevo León</option>
                                    <option>Oaxaca</option>
                                    <option>Puebla</option>
                                    <option>Querétaro</option>
                                    <option>Quintana Roo</option>
                                    <option>San Luis Potosí</option>
                                    <option>Sinaloa</option>
                                    <option>Sonora</option>
                                    <option>Tabasco</option>
                                    <option>Tamaulipas</option>
                                    <option>Tlaxcala</option>
                                    <option>Veracruz</option>
                                    <option>Yucatán</option>
                                    <option>Zacatecas</option>
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label for="alcaldia" class="form-label">Alcaldía / Municipio</label>
                                <select id="alcaldia" class="form-select" required>
                                    <option value="">Seleccione...</option>
                                    <option value="Azcapotzalco">Azcapotzalco</option>
                                    <option value="Coyoacán">Coyoacán</option>
                                    <option value="Cuajimalpa">Cuajimalpa</option>
                                    <option value="Gustavo A. Madero">Gustavo A. Madero</option>
                                    <option value="Iztacalco">Iztacalco</option>
                                    <option value="Iztapalapa">Iztapalapa</option>
                                    <option value="Magdalena Contreras">Magdalena Contreras</option>
                                    <option value="Miguel Hidalgo">Miguel Hidalgo</option>
                                    <option value="Milpa Alta">Milpa Alta</option>
                                    <option value="Tláhuac">Tláhuac</option>
                                    <option value="Tlalpan">Tlalpan</option>
                                    <option value="Venustiano Carranza">Venustiano Carranza</option>
                                    <option value="Xochimilco">Xochimilco</option>
                                    <option value="Álvaro Obregón">Álvaro Obregón</option>
                                    <option value="Benito Juárez">Benito Juárez</option>
                                    <option value="Cuauhtémoc">Cuauhtémoc</option>
                                    <option value="otro">Otro (Municipio)</option>
                                </select>
                                <div class="invalid-feedback">Seleccione una opción.</div>
                            </div>

                            <div class="col-md-6" id="municipio-otro-container" style="display:none;">
                                <label for="municipio-otro" class="form-label">Especifique Municipio</label>
                                <input type="text" id="municipio-otro" class="form-control">
                                <div class="invalid-feedback">Ingrese el nombre del municipio.</div>
                            </div>

                            <div class="col-md-4 d-none" id="municipio-otro-container">
                                <label class="form-label">Especifica municipio</label>
                                <input type="text" id="municipio-otro" class="form-control">
                            </div>

                            <div class="col-md-2">
                                <label class="form-label">CP</label>
                                <input type="text" id="cp-m" class="form-control" required>
                            </div>

                            <div class="col-md-2">
                                <label class="form-label">Teléfono</label>
                                <input type="text" id="telefono-m" class="form-control" required>
                            </div>
                        </div>

                        <hr class="my-4">
                        <h5 class="mb-3">Asignación</h5>

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">Grupo asignado</label>
                                <input type="text" id="grupo-m-texto" class="form-control" disabled>
                                <input type="hidden" id="grupo-m">
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">CENDI</label>
                                <select id="cendi-m" class="form-select" required>
                                    <option value="">Selecciona</option>
                                    <option>CENDI "Amalia Solórzano de Cardenas"</option>
                                    <option>CENDI "Clementina Batalla de Bassols"</option>
                                    <option>CENDI "Eva Samano de Lopez Mateos"</option>
                                    <option>CENDI "Laura Perez de Batiz"</option>
                                    <option>CENDI "Margarita Salazar de Erro"</option>
                                </select>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between mt-4">
                            <a href="acceso.html" class="btn btn-outline-secondary">
                                <i class="bi bi-x-circle me-1"></i>Cancelar
                            </a>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-check-circle me-1"></i>Verificar datos
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    </main>

    <div class="modal fade" id="modalDatos" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Verifica los datos</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="contenidoModal"></div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Modificar</button>
                    <button class="btn btn-success" id="btnConfirmarRegistro">
                        <i class="bi bi-save me-1"></i>Guardar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <footer class="mt-auto py-3">
        <div class="container text-center">
            <p class="mb-1">© 2025 TDAW - IPN - COCENDI</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/nuevo_menor.js"></script>
</body>

</html>