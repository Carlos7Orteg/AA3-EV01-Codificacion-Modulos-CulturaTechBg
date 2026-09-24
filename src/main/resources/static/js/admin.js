/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */
// ============================================================
// Panel administrativo de CulturaTech Bogotá
// Conecta la interfaz HTML con los endpoints de Spring Boot.
// ============================================================

// Inicializa la navegación, formularios y carga de información del panel administrativo.
document.addEventListener('DOMContentLoaded', () => {

    // Referencias a las secciones principales del panel.
    const secciones = document.querySelectorAll('[data-admin-panel]');

    // Referencias a los enlaces de navegación administrativa.
    const enlaces = document.querySelectorAll('[data-admin-section]');

    // Configura la navegación entre las diferentes secciones del panel administrativo.
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', () => {

            // Obtiene la sección seleccionada.
            const seccionSeleccionada = enlace.dataset.adminSection;

            // Oculta todas las secciones.
            secciones.forEach(seccion => {
                seccion.hidden = seccion.dataset.adminPanel !== seccionSeleccionada;
            });

            // Actualiza el enlace activo.
            enlaces.forEach(item => {
                item.classList.toggle('active', item === enlace);
            });
        });
    });

    // Carga inicialmente la información necesaria para las secciones administrativas.
    cargarUsuarios();
    cargarEventos();
    cargarCategorias();
    cargarLugares();
    cargarCategoriasAdmin();
    cargarLugaresAdmin();

    // Configura el formulario de usuarios.
    const usuarioForm = document.getElementById('usuario-form');

    if (usuarioForm) {
        usuarioForm.addEventListener('submit', guardarUsuario);
    }

    // Configura el formulario de eventos.
    const eventoForm = document.getElementById('evento-form');

    if (eventoForm) {
        eventoForm.addEventListener('submit', guardarEvento);
    }
    
    // Configura el formulario de lugares.
    const lugarForm = document.getElementById('lugar-form');

    if (lugarForm) {
        lugarForm.addEventListener('submit', guardarLugar);
    }
    
    // Gestiona el registro y actualización de categorías.
    document.getElementById('categoria-form').addEventListener('submit', async function (event) {

        // Evita que el formulario recargue la página.
        event.preventDefault();

        // Obtiene el identificador para determinar si es registro o actualización.
        const id = document.getElementById('categoria-id').value;

        // Obtiene los datos escritos en el formulario.
        const categoria = {
            nombreCategoria: document.getElementById('categoria-nombre').value.trim(),
            descripcion: document.getElementById('categoria-descripcion').value.trim()
        };

        try {

            // Determina el método según exista o no un identificador.
            const method = id ? 'PUT' : 'POST';

            // Determina la URL correspondiente al registro.
            const url = id
                    ? `/api/categorias/${id}`
                    : '/api/categorias';

            // Envía la información a la API.
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            });

            if (!response.ok) {
                throw new Error(
                        id
                        ? 'No fue posible actualizar la categoría.'
                        : 'No fue posible registrar la categoría.'
                        );
            }

            // Limpia el formulario después de guardar.
            limpiarFormularioCategoria();

            // Actualiza la tabla de categorías.
            await cargarCategoriasAdmin();

            // Actualiza también el selector de categorías de Eventos.
            await cargarCategorias();

            // Informa que la operación terminó correctamente.
            mostrarAlerta(
                    id
                    ? 'Categoría actualizada correctamente.'
                    : 'Categoría registrada correctamente.',
                    'success'
                    );

        } catch (error) {

            // Muestra el error de la operación.
            mostrarAlerta(error.message, 'error');
        }
    });

    // Configura los botones para cancelar las ediciones.
    document.getElementById('usuario-cancelar')
        ?.addEventListener('click', limpiarFormularioUsuario);

    document.getElementById('evento-cancelar')
        ?.addEventListener('click', limpiarFormularioEvento);
});


// ============================================================
// USUARIOS
// ============================================================

// Consulta los usuarios registrados en Spring Boot.
async function cargarUsuarios() {

    try {
        // Solicita al controlador los usuarios registrados.
        const response = await fetch('/api/usuarios');

        // Comprueba si el servidor respondió correctamente.
        if (!response.ok) {
            throw new Error('No fue posible consultar los usuarios.');
        }

        // Convierte la respuesta JSON en una lista de usuarios.
        const usuarios = await response.json();

        // Obtiene el cuerpo de la tabla.
        const tbody = document.getElementById('usuarios-table-body');

        // Limpia el contenido anterior.
        tbody.innerHTML = '';

        // Genera una fila para cada usuario.
        usuarios.forEach(usuario => {

            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td class="admin-id">${usuario.idUsuario}</td>

                <td>
                    ${usuario.nombres || ''} ${usuario.apellidos || ''}
                </td>

                <td>
                    ${usuario.correo || ''}
                </td>

                <td>
                    <span class="admin-role">
                        ${usuario.rol || ''}
                    </span>
                </td>

                <td>
                    <div class="admin-actions">

                        <button
                            type="button"
                            class="admin-action-link"
                            onclick="editarUsuario(${usuario.idUsuario})">
                            Editar
                        </button>

                        <button
                            type="button"
                            class="admin-action-button"
                            onclick="eliminarUsuario(${usuario.idUsuario})">
                            Eliminar
                        </button>

                    </div>
                </td>
            `;

            tbody.appendChild(fila);
        });

        // Actualiza el contador de registros.
        document.getElementById('usuarios-count').textContent =
            `${usuarios.length} registros`;

    } catch (error) {

        // Muestra el error en la interfaz.
        mostrarAlerta(error.message, 'error');
    }
}


// Guarda un usuario nuevo o actualiza uno existente.
// Cuando la operación requiere seguridad adicional, utiliza el modal definido en admin.html.
async function guardarUsuario(event) {

    // Evita que el formulario recargue la página.
    event.preventDefault();

    // Obtiene el identificador del usuario.
    const id = document.getElementById('usuario-id').value;

    // Construye el objeto que será enviado a Spring Boot.
    const usuario = {
        nombres: document.getElementById('usuario-nombres').value.trim(),
        apellidos: document.getElementById('usuario-apellidos').value.trim(),
        documento: document.getElementById('usuario-documento').value.trim(),
        fechaNacimiento: document.getElementById('usuario-fecha').value,
        correo: document.getElementById('usuario-correo').value.trim(),
        contrasena: document.getElementById('usuario-contrasena').value,
        rol: document.getElementById('usuario-rol').value
    };

    // Almacena las credenciales adicionales requeridas por el backend.
    let seguridad = {};

    try {

        // Cuando se actualiza un usuario, determina quién realiza la operación
        // y cuál es el rol actual del usuario que se está modificando.
        if (id) {

            const perfilResponse = await fetch('/api/auth/perfil');

            if (!perfilResponse.ok) {
                throw new Error('Sesión no válida.');
            }

            const administrador = await perfilResponse.json();

            const objetivoResponse =
                    await fetch(`/api/usuarios/${id}`);

            if (!objetivoResponse.ok) {
                throw new Error('No fue posible consultar el usuario.');
            }

            const objetivo = await objetivoResponse.json();

            // Determina si el administrador está editando su propio usuario.
            const esPropioUsuario =
                    Number(administrador.idUsuario) === Number(id);

            // ========================================================
            // SEGURIDAD PARA EDITAR OTRO ADMINISTRADOR
            // ========================================================
            if (!esPropioUsuario && objetivo.rol === 'ADMIN') {

                const modal =
                        document.getElementById('usuario-seguridad-modal');

                const form =
                        document.getElementById('usuario-seguridad-form');

                const titulo =
                        document.getElementById('usuario-seguridad-titulo');

                const mensaje =
                        document.getElementById('usuario-seguridad-mensaje');

                const campoSeguridad =
                        document.getElementById('campo-contrasena-seguridad');

                const camposCambio =
                        document.getElementById('campos-cambio-contrasena');

                const contrasenaSeguridad =
                        document.getElementById(
                                'usuario-contrasena-seguridad'
                                );

                const cancelar =
                        document.getElementById('usuario-seguridad-cancelar');

                const cerrar =
                        document.getElementById('usuario-seguridad-cerrar');

                titulo.textContent = 'Confirmación de seguridad';

                mensaje.textContent =
                        'Para editar otro administrador, confirme su contraseña.';

                campoSeguridad.hidden = false;
                camposCambio.hidden = true;

                contrasenaSeguridad.value = '';

                modal.hidden = false;

                const datosSeguridad = await new Promise(resolve => {

                    // Confirma la contraseña del administrador que realiza la operación.
                    form.onsubmit = function (modalEvent) {

                        modalEvent.preventDefault();

                        const contrasena =
                                contrasenaSeguridad.value;

                        if (!contrasena.trim()) {
                            mensaje.textContent =
                                    'Debe ingresar la contraseña del administrador.';
                            return;
                        }

                        modal.hidden = true;

                        resolve({
                            contrasenaSeguridad: contrasena
                        });
                    };

                    // Cancela la operación de seguridad.
                    cancelar.onclick = function () {
                        modal.hidden = true;
                        resolve(null);
                    };

                    // Cierra la ventana de seguridad.
                    cerrar.onclick = function () {
                        modal.hidden = true;
                        resolve(null);
                    };
                });

                // Si se cancela la ventana, no continúa con la actualización.
                if (!datosSeguridad) {
                    return;
                }

                seguridad = datosSeguridad;
            }

            // ========================================================
            // SEGURIDAD PARA CAMBIAR LA PROPIA CONTRASEÑA
            // ========================================================
            if (esPropioUsuario && usuario.contrasena.trim()) {

                const modal =
                        document.getElementById('usuario-seguridad-modal');

                const form =
                        document.getElementById('usuario-seguridad-form');

                const titulo =
                        document.getElementById('usuario-seguridad-titulo');

                const mensaje =
                        document.getElementById('usuario-seguridad-mensaje');

                const campoSeguridad =
                        document.getElementById('campo-contrasena-seguridad');

                const camposCambio =
                        document.getElementById('campos-cambio-contrasena');

                const contrasenaActual =
                        document.getElementById('usuario-contrasena-actual');

                const nuevaContrasena =
                        document.getElementById('usuario-nueva-contrasena');

                const confirmarContrasena =
                        document.getElementById(
                                'usuario-confirmar-contrasena'
                                );

                const cancelar =
                        document.getElementById('usuario-seguridad-cancelar');

                const cerrar =
                        document.getElementById('usuario-seguridad-cerrar');

                titulo.textContent = 'Cambio de contraseña';

                mensaje.textContent =
                        'Ingrese su contraseña actual y la nueva contraseña.';

                campoSeguridad.hidden = true;
                camposCambio.hidden = false;

                contrasenaActual.value = '';
                nuevaContrasena.value = '';
                confirmarContrasena.value = '';

                modal.hidden = false;

                const datosCambio = await new Promise(resolve => {

                    // Procesa la solicitud de cambio de contraseña.
                    form.onsubmit = function (modalEvent) {

                        modalEvent.preventDefault();

                        if (
                                !contrasenaActual.value.trim()
                                || !nuevaContrasena.value.trim()
                                || !confirmarContrasena.value.trim()
                                ) {
                            mensaje.textContent =
                                    'Debe completar los tres campos de contraseña.';
                            return;
                        }

                        if (
                                nuevaContrasena.value
                                !== confirmarContrasena.value
                                ) {
                            mensaje.textContent =
                                    'La nueva contraseña y su confirmación no coinciden.';
                            return;
                        }

                        modal.hidden = true;

                        resolve({
                            contrasenaActual:
                                    contrasenaActual.value,
                            nuevaContrasena:
                                    nuevaContrasena.value,
                            confirmarContrasena:
                                    confirmarContrasena.value
                        });
                    };

                    // Cancela el cambio de contraseña.
                    cancelar.onclick = function () {
                        modal.hidden = true;
                        resolve(null);
                    };

                    // Cierra la ventana de cambio.
                    cerrar.onclick = function () {
                        modal.hidden = true;
                        resolve(null);
                    };
                });

                // Si se cancela la ventana, no continúa con la actualización.
                if (!datosCambio) {
                    return;
                }

                seguridad = datosCambio;
            }
        }

        // Determina si se crea o se actualiza el registro.
        const url = id
                ? `/api/usuarios/${id}`
                : '/api/usuarios';

        const method = id ? 'PUT' : 'POST';

        // Envía los datos al controlador Spring Boot.
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: {
                    idUsuario: id,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    documento: usuario.documento,
                    fechaNacimiento: usuario.fechaNacimiento,
                    correo: usuario.correo,
                    contrasena: usuario.contrasena,
                    rol: usuario.rol
                },

                ...seguridad
            })
        });

        // Comprueba el resultado de la operación.
        if (!response.ok) {

            const errorData =
                    await response.json().catch(() => ({}));

            throw new Error(
                    errorData.mensaje
                    || 'No fue posible guardar el usuario.'
                    );
        }

        // Muestra confirmación al usuario.
        mostrarAlerta(
                id
                ? 'Usuario actualizado correctamente.'
                : 'Usuario registrado correctamente.',
                'success'
                );

        // Limpia el formulario.
        limpiarFormularioUsuario();

        // Actualiza la tabla.
        cargarUsuarios();

    } catch (error) {

        // Muestra el error generado durante la operación.
        mostrarAlerta(error.message, 'error');
    }
}

// Carga un usuario en el formulario para editarlo.
async function editarUsuario(id) {

    try {

        // Consulta el usuario seleccionado.
        const response = await fetch(`/api/usuarios/${id}`);

        // Comprueba la respuesta del servidor.
        if (!response.ok) {
            throw new Error('No fue posible consultar el usuario.');
        }

        // Convierte la respuesta JSON.
        const usuario = await response.json();

        // Carga los datos en el formulario.
        document.getElementById('usuario-id').value = usuario.idUsuario;
        document.getElementById('usuario-nombres').value = usuario.nombres || '';
        document.getElementById('usuario-apellidos').value = usuario.apellidos || '';
        document.getElementById('usuario-documento').value = usuario.documento || '';
        document.getElementById('usuario-fecha').value = usuario.fechaNacimiento || '';
        document.getElementById('usuario-correo').value = usuario.correo || '';
        document.getElementById('usuario-contrasena').value = '';
        document.getElementById('usuario-rol').value = usuario.rol || 'USER';

        // Cambia el título del formulario.
        document.getElementById('usuario-form-title').textContent =
            'Actualizar usuario';

        // Cambia el texto del botón.
        document.getElementById('usuario-submit-text').textContent =
            'Guardar cambios';

        // Cambia el icono del botón.
        document.getElementById('usuario-submit-icon').textContent =
            'save';

        // Muestra el botón cancelar.
        document.getElementById('usuario-cancelar').hidden = false;

    } catch (error) {

        // Muestra el error en la interfaz.
        mostrarAlerta(error.message, 'error');
    }
}


// Elimina un usuario después de solicitar confirmación.
async function eliminarUsuario(id) {

    // Solicita confirmación antes de eliminar.
    if (!confirm('¿Eliminar este usuario?')) {
        return;
    }

    try {

        // Envía la solicitud DELETE a Spring Boot.
        const response = await fetch(`/api/usuarios/${id}`, {
            method: 'DELETE'
        });

        // Comprueba el resultado.
        if (!response.ok) {
            throw new Error('No fue posible eliminar el usuario.');
        }

        // Informa que la operación terminó.
        mostrarAlerta(
            'Usuario eliminado correctamente.',
            'success'
        );

        // Actualiza la tabla.
        cargarUsuarios();

    } catch (error) {

        // Muestra el error generado.
        mostrarAlerta(error.message, 'error');
    }
}


// Limpia el formulario de usuarios.
function limpiarFormularioUsuario() {

    document.getElementById('usuario-form').reset();

    document.getElementById('usuario-id').value = '';

    document.getElementById('usuario-form-title').textContent =
        'Registrar usuario';

    document.getElementById('usuario-submit-text').textContent =
        'Registrar usuario';

    document.getElementById('usuario-submit-icon').textContent =
        'person_add';

    document.getElementById('usuario-cancelar').hidden = true;
}


// ============================================================
// EVENTOS
// ============================================================

// Consulta los eventos registrados en Spring Boot.
async function cargarEventos() {

    try {

        // Solicita los eventos al controlador.
        const response = await fetch('/api/eventos');

        // Comprueba la respuesta.
        if (!response.ok) {
            throw new Error('No fue posible consultar los eventos.');
        }

        // Convierte la respuesta JSON.
        const eventos = await response.json();

        // Obtiene el contenedor de tarjetas.
        const container = document.getElementById('eventos-list');

        // Limpia el contenido anterior.
        container.innerHTML = '';

        // Genera una tarjeta para cada evento.
        eventos.forEach(evento => {

            const card = document.createElement('article');

            card.className = 'admin-event-card';

            card.innerHTML = `
                <h4>${evento.titulo || ''}</h4>

                <p class="admin-event-meta">
                    ${evento.categoria?.nombreCategoria || ''}
                    ·
                    ${evento.lugar?.nombreLugar || ''}
                </p>

                <p class="admin-event-description">
                    ${evento.descripcion || ''}
                </p>

                <div class="admin-card-actions">

                    <button
                        type="button"
                        class="admin-action-link"
                        onclick="editarEvento(${evento.idEvento})">
                        Editar
                    </button>

                    <button
                        type="button"
                        class="admin-action-button"
                        onclick="eliminarEvento(${evento.idEvento})">
                        Eliminar
                    </button>

                </div>
            `;

            container.appendChild(card);
        });

        // Actualiza el contador.
        document.getElementById('eventos-count').textContent =
            `${eventos.length} registros`;

    } catch (error) {

        // Muestra el error en la interfaz.
        mostrarAlerta(error.message, 'error');
    }
}


// Guarda un evento nuevo o actualiza uno existente.
async function guardarEvento(event) {

    // Evita la recarga del formulario.
    event.preventDefault();

    // Obtiene el identificador del evento.
    const id = document.getElementById('evento-id').value;

    // Construye el objeto compatible con la entidad Evento.
    const evento = {
        titulo: document.getElementById('evento-titulo').value.trim(),
        descripcion: document.getElementById('evento-descripcion').value.trim(),
        fechaHora: document.getElementById('evento-fecha').value,
        costo: document.getElementById('evento-costo').value,
        imagen: document.getElementById('evento-imagen').value.trim(),
        estado: document.getElementById('evento-estado').value,

        categoria: {
            idCategoria: Number(
                document.getElementById('evento-categoria').value
            )
        },

        lugar: {
            idLugar: Number(
                document.getElementById('evento-lugar').value
            )
        }
    };

    // Determina la URL y el método según la operación.
    const url = id
        ? `/api/eventos/${id}`
        : '/api/eventos';

    const method = id ? 'PUT' : 'POST';

    try {

        // Envía el evento al controlador.
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(evento)
        });

        // Comprueba el resultado.
        if (!response.ok) {
            throw new Error('No fue posible guardar el evento.');
        }

        // Muestra confirmación.
        mostrarAlerta(
            id
                ? 'Evento actualizado correctamente.'
                : 'Evento registrado correctamente.',
            'success'
        );

        // Limpia el formulario.
        limpiarFormularioEvento();

        // Actualiza la lista.
        cargarEventos();

    } catch (error) {

        // Muestra el error.
        mostrarAlerta(error.message, 'error');
    }
}


// Carga un evento en el formulario para editarlo.
async function editarEvento(id) {

    try {

        // Consulta el evento seleccionado.
        const response = await fetch(`/api/eventos/${id}`);

        // Comprueba la respuesta.
        if (!response.ok) {
            throw new Error('No fue posible consultar el evento.');
        }

        // Convierte la respuesta JSON.
        const evento = await response.json();

        // Carga los datos principales.
        document.getElementById('evento-id').value = evento.idEvento;
        document.getElementById('evento-titulo').value = evento.titulo || '';
        document.getElementById('evento-descripcion').value =
            evento.descripcion || '';

        // Convierte la fecha al formato requerido por datetime-local.
        document.getElementById('evento-fecha').value =
            evento.fechaHora
                ? evento.fechaHora.substring(0, 16)
                : '';

        document.getElementById('evento-costo').value =
            evento.costo || 0;

        document.getElementById('evento-imagen').value =
            evento.imagen || '';

        document.getElementById('evento-estado').value =
            evento.estado || 'ACTIVO';

        // Carga las relaciones del evento.
        document.getElementById('evento-categoria').value =
            evento.categoria?.idCategoria || '';

        document.getElementById('evento-lugar').value =
            evento.lugar?.idLugar || '';

        // Cambia el título del formulario.
        document.getElementById('evento-form-title').textContent =
            'Actualizar evento';

        // Cambia el texto del botón.
        document.getElementById('evento-submit-text').textContent =
            'Guardar cambios';

        // Cambia el icono.
        document.getElementById('evento-submit-icon').textContent =
            'save';

        // Muestra el botón cancelar.
        document.getElementById('evento-cancelar').hidden = false;

    } catch (error) {

        // Muestra el error.
        mostrarAlerta(error.message, 'error');
    }
}


// Elimina un evento después de solicitar confirmación.
async function eliminarEvento(id) {

    // Solicita confirmación antes de eliminar.
    if (!confirm('¿Eliminar este evento?')) {
        return;
    }

    try {

        // Envía la solicitud DELETE.
        const response = await fetch(`/api/eventos/${id}`, {
            method: 'DELETE'
        });

        // Comprueba el resultado.
        if (!response.ok) {
            throw new Error('No fue posible eliminar el evento.');
        }

        // Muestra confirmación.
        mostrarAlerta(
            'Evento eliminado correctamente.',
            'success'
        );

        // Actualiza la lista.
        cargarEventos();

    } catch (error) {

        // Muestra el error.
        mostrarAlerta(error.message, 'error');
    }
}


// Limpia el formulario de eventos.
function limpiarFormularioEvento() {

    document.getElementById('evento-form').reset();

    document.getElementById('evento-id').value = '';

    document.getElementById('evento-form-title').textContent =
        'Registrar evento';

    document.getElementById('evento-submit-text').textContent =
        'Registrar evento';

    document.getElementById('evento-submit-icon').textContent =
        'add';

    document.getElementById('evento-cancelar').hidden = true;
}


// ============================================================
// CATEGORÍAS Y LUGARES
// ============================================================

// Carga las categorías para los selectores de eventos.
async function cargarCategorias() {

    try {

        // Consulta las categorías disponibles.
        const response = await fetch('/api/categorias');

        if (!response.ok) {
            throw new Error('No fue posible consultar las categorías.');
        }

        const categorias = await response.json();

        const select = document.getElementById('evento-categoria');

        select.innerHTML = '<option value="">Seleccione una categoría</option>';

        categorias.forEach(categoria => {

            const option = document.createElement('option');

            option.value = categoria.idCategoria;
            option.textContent = categoria.nombreCategoria;

            select.appendChild(option);
        });

    } catch (error) {

        // Muestra el error de consulta.
        mostrarAlerta(error.message, 'error');
    }
}

//Carga las categorías registradas en la tabla del panel administrativo.
async function cargarCategoriasAdmin() {
    
    try {
        //Consulta todas las categorías mediante la API.
        const response = await fetch('/api/categorias');
        
        if (!response.ok) {
            throw new Error('No fue posible consultar las categorías.');
        }
        
        const categorias = await response.json();
        
        //Obtiene el cuerpo de la tabla de categorías.
        const tbody = document.getElementById('categorias-table-body');
        
        // Limpia la tabla antes de mostrar los registros.
        tbody.innerHTML = '';
        
        // Actualiza el contador de categorías.
        document.getElementById('categorias-count').textContent =
            `${categorias.length} registros`;

        // Recorre las categorías recibidas y crea cada fila.
        categorias.forEach(categoria => {

            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${categoria.idCategoria}</td>
                <td>${categoria.nombreCategoria}</td>
                <td>${categoria.descripcion ?? ''}</td>
                <td>
                    <button
                        type="button"
                        class="admin-btn admin-btn-secondary"
                        onclick="editarCategoria(${categoria.idCategoria})">
                        <span class="material-symbols-outlined">edit</span>
                        Editar
                    </button>

                    <button
                        type="button"
                        class="admin-btn admin-btn-danger"
                        onclick="eliminarCategoria(${categoria.idCategoria})">
                        <span class="material-symbols-outlined">delete</span>
                        Eliminar
                    </button>
                </td>
            `;

            tbody.appendChild(fila);
        });

    } catch (error) {

        // Muestra el error de consulta.
        mostrarAlerta(error.message, 'error');
    }
}

// Limpia el formulario de categorías y lo devuelve al modo de registro.
function limpiarFormularioCategoria() {

    // Limpia el identificador oculto.
    document.getElementById('categoria-id').value = '';

    // Limpia los campos del formulario.
    document.getElementById('categoria-nombre').value = '';
    document.getElementById('categoria-descripcion').value = '';

    // Restablece el texto del botón.
    document.getElementById('categoria-submit-text').textContent =
        'Registrar categoría';

    // Restablece el icono del botón.
    document.getElementById('categoria-submit-icon').textContent =
        'category';

    // Oculta el botón Cancelar.
    document.getElementById('categoria-cancelar').classList.add('hidden');
}

// Carga una categoría en el formulario para editar sus datos.
async function editarCategoria(id) {

    try {

        // Consulta la categoría seleccionada.
        const response = await fetch(`/api/categorias/${id}`);

        if (!response.ok) {
            throw new Error('No fue posible consultar la categoría.');
        }

        const categoria = await response.json();

        // Coloca los datos recibidos en el formulario.
        document.getElementById('categoria-id').value =
            categoria.idCategoria;

        document.getElementById('categoria-nombre').value =
            categoria.nombreCategoria;

        document.getElementById('categoria-descripcion').value =
            categoria.descripcion ?? '';

        // Cambia el formulario al modo de edición.
        document.getElementById('categoria-submit-text').textContent =
            'Actualizar categoría';

        document.getElementById('categoria-submit-icon').textContent =
            'save';

        // Muestra el botón para cancelar la edición.
        document.getElementById('categoria-cancelar')
            .classList.remove('hidden');

        // Lleva la vista hacia el formulario.
        document.getElementById('categoria-form')
            .scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {

        // Muestra el error de consulta.
        mostrarAlerta(error.message, 'error');
    }
}

// Elimina una categoría seleccionada desde el panel administrativo.
async function eliminarCategoria(id) {

    // Solicita confirmación antes de eliminar el registro.
    const confirmar = confirm(
        '¿Está seguro de que desea eliminar esta categoría?'
    );

    if (!confirmar) {
        return;
    }

    try {

        // Envía la solicitud DELETE a la API.
        const response = await fetch(`/api/categorias/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('No fue posible eliminar la categoría.');
        }

        // Actualiza la tabla después de eliminar.
        await cargarCategoriasAdmin();

        // Actualiza el selector utilizado por Eventos.
        await cargarCategorias();

        // Informa que la eliminación fue realizada.
        mostrarAlerta(
            'Categoría eliminada correctamente.',
            'success'
        );

    } catch (error) {

        // Muestra el error de eliminación.
        mostrarAlerta(error.message, 'error');
    }
}

// Configura el botón Cancelar del formulario de categorías.
document.getElementById('categoria-cancelar').addEventListener('click', function () {

    // Limpia el formulario y vuelve al modo de registro.
    limpiarFormularioCategoria();
});

// Carga los lugares para los selectores de eventos.
async function cargarLugares() {

    try {

        // Consulta los lugares disponibles.
        const response = await fetch('/api/lugares');

        if (!response.ok) {
            throw new Error('No fue posible consultar los lugares.');
        }

        const lugares = await response.json();

        const select = document.getElementById('evento-lugar');

        select.innerHTML = '<option value="">Seleccione un lugar</option>';

        lugares.forEach(lugar => {

            const option = document.createElement('option');

            option.value = lugar.idLugar;
            option.textContent = lugar.nombreLugar;

            select.appendChild(option);
        });

    } catch (error) {

        // Muestra el error de consulta.
        mostrarAlerta(error.message, 'error');
    }
}

// Carga los lugares registrados en la tabla del panel administrativo.
async function cargarLugaresAdmin() {

    try {

        // Consulta todos los lugares mediante la API.
        const response = await fetch('/api/lugares');

        if (!response.ok) {
            throw new Error('No fue posible consultar los lugares.');
        }

        const lugares = await response.json();

        // Obtiene el cuerpo de la tabla de lugares.
        const tbody = document.getElementById('lugares-table-body');

        // Limpia la tabla antes de mostrar los registros.
        tbody.innerHTML = '';

        // Actualiza el contador de lugares.
        document.getElementById('lugares-count').textContent =
            `${lugares.length} registros`;

        // Recorre los lugares y crea cada fila.
        lugares.forEach(lugar => {

            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${lugar.idLugar}</td>
                <td>${lugar.nombreLugar}</td>
                <td>${lugar.direccion ?? ''}</td>
                <td>${lugar.localidad ?? ''}</td>
                <td>${lugar.telefono ?? ''}</td>
                <td>
                    <button
                        type="button"
                        class="admin-btn admin-btn-secondary"
                        onclick="editarLugar(${lugar.idLugar})">
                        <span class="material-symbols-outlined">edit</span>
                        Editar
                    </button>

                    <button
                        type="button"
                        class="admin-btn admin-btn-danger"
                        onclick="eliminarLugar(${lugar.idLugar})">
                        <span class="material-symbols-outlined">delete</span>
                        Eliminar
                    </button>
                </td>
            `;

            tbody.appendChild(fila);
        });

    } catch (error) {

        // Muestra el error de consulta.
        mostrarAlerta(error.message, 'error');
    }
}

// Registra un nuevo lugar o actualiza uno existente.
async function guardarLugar(event) {

    // Evita que el formulario recargue la página.
    event.preventDefault();

    // Obtiene el identificador oculto del formulario.
    const id = document.getElementById('lugar-id').value;

    // Obtiene los datos escritos en el formulario.
    const lugar = {
        nombreLugar: document.getElementById('lugar-nombre').value.trim(),
        direccion: document.getElementById('lugar-direccion').value.trim(),
        localidad: document.getElementById('lugar-localidad').value.trim(),
        telefono: document.getElementById('lugar-telefono').value.trim(),
        latitud: document.getElementById('lugar-latitud').value
            ? Number(document.getElementById('lugar-latitud').value)
            : null,
        longitud: document.getElementById('lugar-longitud').value
            ? Number(document.getElementById('lugar-longitud').value)
            : null,
        paginaWeb: document.getElementById('lugar-pagina').value.trim()
    };

    try {

        // Define POST para crear y PUT para actualizar.
        const method = id ? 'PUT' : 'POST';

        // Define la URL según sea registro o actualización.
        const url = id
            ? `/api/lugares/${id}`
            : '/api/lugares';

        // Envía los datos a la API.
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lugar)
        });

        if (!response.ok) {
            throw new Error(
                id
                    ? 'No fue posible actualizar el lugar.'
                    : 'No fue posible registrar el lugar.'
            );
        }

        // Limpia el formulario.
        limpiarFormularioLugar();

        // Actualiza la tabla.
        await cargarLugaresAdmin();

        // Actualiza el selector de lugares de Eventos.
        await cargarLugares();

        // Informa el resultado.
        mostrarAlerta(
            id
                ? 'Lugar actualizado correctamente.'
                : 'Lugar registrado correctamente.',
            'success'
        );

    } catch (error) {

        // Muestra el error de la operación.
        mostrarAlerta(error.message, 'error');
    }
}

// Limpia el formulario de lugares y lo devuelve al modo de registro.
function limpiarFormularioLugar() {

    // Limpia el identificador oculto.
    document.getElementById('lugar-id').value = '';

    // Limpia los campos del formulario.
    document.getElementById('lugar-nombre').value = '';
    document.getElementById('lugar-direccion').value = '';
    document.getElementById('lugar-localidad').value = '';
    document.getElementById('lugar-telefono').value = '';
    document.getElementById('lugar-latitud').value = '';
    document.getElementById('lugar-longitud').value = '';
    document.getElementById('lugar-pagina').value = '';

    // Restablece el texto del botón.
    document.getElementById('lugar-submit-text').textContent =
        'Registrar lugar';

    // Restablece el icono del botón.
    document.getElementById('lugar-submit-icon').textContent =
        'location_on';

    // Oculta el botón Cancelar.
    document.getElementById('lugar-cancelar').classList.add('hidden');
}

// Carga un lugar en el formulario para editar sus datos.
async function editarLugar(id) {

    try {

        // Consulta el lugar seleccionado.
        const response = await fetch(`/api/lugares/${id}`);

        if (!response.ok) {
            throw new Error('No fue posible consultar el lugar.');
        }

        const lugar = await response.json();

        // Coloca los datos recibidos en el formulario.
        document.getElementById('lugar-id').value =
            lugar.idLugar;

        document.getElementById('lugar-nombre').value =
            lugar.nombreLugar ?? '';

        document.getElementById('lugar-direccion').value =
            lugar.direccion ?? '';

        document.getElementById('lugar-localidad').value =
            lugar.localidad ?? '';

        document.getElementById('lugar-telefono').value =
            lugar.telefono ?? '';

        document.getElementById('lugar-latitud').value =
            lugar.latitud ?? '';

        document.getElementById('lugar-longitud').value =
            lugar.longitud ?? '';

        document.getElementById('lugar-pagina').value =
            lugar.paginaWeb ?? '';

        // Cambia el formulario al modo de edición.
        document.getElementById('lugar-submit-text').textContent =
            'Actualizar lugar';

        document.getElementById('lugar-submit-icon').textContent =
            'save';

        // Muestra el botón Cancelar.
        document.getElementById('lugar-cancelar')
            .classList.remove('hidden');

        // Lleva la vista hacia el formulario.
        document.getElementById('lugar-form')
            .scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

    } catch (error) {

        // Muestra el error de consulta.
        mostrarAlerta(error.message, 'error');
    }
}

// Elimina un lugar seleccionado desde el panel administrativo.
async function eliminarLugar(id) {

    // Solicita confirmación antes de eliminar el registro.
    const confirmar = confirm(
        '¿Está seguro de que desea eliminar este lugar?'
    );

    if (!confirmar) {
        return;
    }

    try {

        // Envía la solicitud DELETE a la API.
        const response = await fetch(`/api/lugares/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('No fue posible eliminar el lugar.');
        }

        // Actualiza la tabla después de eliminar.
        await cargarLugaresAdmin();

        // Actualiza el selector utilizado por Eventos.
        await cargarLugares();

        // Informa que la eliminación fue realizada.
        mostrarAlerta(
            'Lugar eliminado correctamente.',
            'success'
        );

    } catch (error) {

        // Muestra el error de eliminación.
        mostrarAlerta(error.message, 'error');
    }
}

// Configura el botón Cancelar del formulario de lugares.
document.getElementById('lugar-cancelar').addEventListener('click', function () {

    // Limpia el formulario y vuelve al modo de registro.
    limpiarFormularioLugar();
});

// ============================================================
// MENSAJES DE LA INTERFAZ
// ============================================================

// Muestra mensajes de éxito o error dentro del panel.
function mostrarAlerta(mensaje, tipo) {

    const alerta = document.getElementById('admin-alert');
    const icono = document.getElementById('admin-alert-icon');
    const texto = document.getElementById('admin-alert-message');

    // Define el texto del mensaje.
    texto.textContent = mensaje;

    // Define el icono según el tipo de mensaje.
    icono.textContent =
        tipo === 'success'
            ? 'check_circle'
            : 'error';

    // Muestra la alerta.
    alerta.hidden = false;

    // Actualiza las clases visuales.
    alerta.classList.remove(
        'admin-alert-success',
        'admin-alert-error'
    );

    alerta.classList.add(
        tipo === 'success'
            ? 'admin-alert-success'
            : 'admin-alert-error'
    );
}
