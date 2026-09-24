/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

// Ejecuta la carga de información cuando el documento HTML termina de cargarse.
document.addEventListener('DOMContentLoaded', async () => {

    // Solicita al backend los datos del usuario autenticado.
    const response = await fetch('/api/auth/perfil');

    // Si la sesión no es válida, redirige al inicio de sesión.
    if (!response.ok) {
        window.location.replace('/pages/login.html');
        return;
    }

    // Convierte la respuesta del servidor a un objeto JavaScript.
    const usuario = await response.json();

    // Carga los datos del usuario en el formulario.
    document.getElementById('nombres').value = usuario.nombres || '';
    document.getElementById('apellidos').value = usuario.apellidos || '';
    document.getElementById('documento').value = usuario.documento || '';
    document.getElementById('fechaNacimiento').value =
        usuario.fechaNacimiento || '';
    document.getElementById('correo').value = usuario.correo || '';
  
    // Obtiene el formulario principal del perfil.
    const formulario = document.getElementById('perfil-form');

    // Controla el envío del formulario de perfil.
    formulario.addEventListener('submit', async (event) => {

        // Evita que el formulario navegue a otra página.
        event.preventDefault();

        // Obtiene la nueva contraseña ingresada en el perfil.
        const nuevaContrasena =
            document.getElementById('contrasena').value.trim();

        // Si no se ingresó una contraseña, conserva el comportamiento
        // normal del formulario para los demás datos del perfil.
        if (!nuevaContrasena) {
            formulario.submit();
            return;
        }

        // Obtiene los elementos del modal de seguridad.
        const modal =
            document.getElementById('usuario-seguridad-modal');

        const form =
            document.getElementById('usuario-seguridad-form');

        const mensaje =
            document.getElementById('usuario-seguridad-mensaje');

        const contrasenaActual =
            document.getElementById('usuario-contrasena-actual');

        const nuevaContrasenaModal =
            document.getElementById('usuario-nueva-contrasena');

        const confirmarContrasena =
            document.getElementById('usuario-confirmar-contrasena');

        const cancelar =
            document.getElementById('usuario-seguridad-cancelar');

        const cerrar =
            document.getElementById('usuario-seguridad-cerrar');

        // Carga la nueva contraseña ingresada en el formulario
        // dentro del modal.
        nuevaContrasenaModal.value = nuevaContrasena;

        // Limpia la contraseña actual y la confirmación.
        contrasenaActual.value = '';
        confirmarContrasena.value = '';

        // Restablece el mensaje inicial del modal.
        mensaje.textContent =
            'Ingrese su contraseña actual y confirme la nueva contraseña.';
    
        // Muestra los campos necesarios para cambiar la contraseña.
        document.getElementById('campos-cambio-contrasena').hidden = false;

        // Muestra el modal de seguridad.
        modal.hidden = false;

        // Espera la confirmación o cancelación del usuario.
        const datosCambio = await new Promise(resolve => {

            // Procesa la confirmación del cambio de contraseña.
            form.onsubmit = function (modalEvent) {

                // Evita que el formulario del modal recargue la página.
                modalEvent.preventDefault();

                // Verifica que los tres campos estén diligenciados.
                if (
                    !contrasenaActual.value.trim()
                    || !nuevaContrasenaModal.value.trim()
                    || !confirmarContrasena.value.trim()
                ) {
                    mensaje.textContent =
                        'Debe completar los tres campos de contraseña.';
                    return;
                }

                // Verifica que la nueva contraseña y su confirmación coincidan.
                if (
                    nuevaContrasenaModal.value
                    !== confirmarContrasena.value
                ) {
                    mensaje.textContent =
                        'La nueva contraseña y su confirmación no coinciden.';
                    return;
                }

                // Cierra el modal después de validar los datos.
                modal.hidden = true;

                // Devuelve los datos para enviarlos al backend.
                resolve({
                    contrasenaActual: contrasenaActual.value,
                    nuevaContrasena: nuevaContrasenaModal.value,
                    confirmarContrasena: confirmarContrasena.value
                });
            };

            // Cancela el cambio de contraseña.
            cancelar.onclick = function () {
                modal.hidden = true;
                resolve(null);
            };

            // Cierra el modal y cancela la operación.
            cerrar.onclick = function () {
                modal.hidden = true;
                resolve(null);
            };
        });

        // Si el usuario cancela, no continúa con la actualización.
        if (!datosCambio) {
            return;
        }

        try {

            // Envía al backend las credenciales necesarias
            // para actualizar la contraseña.
            const cambio = await fetch('/api/auth/perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosCambio)
            });

            // Convierte la respuesta del backend a JSON.
            const resultado = await cambio.json();

            // Si el backend rechaza la operación, muestra el mensaje.
            if (!cambio.ok) {
                mensaje.textContent =
                    resultado.mensaje
                    || 'No fue posible actualizar la contraseña.';

                modal.hidden = false;
                return;
            }

            // Informa que la contraseña fue actualizada correctamente.
            alert(resultado.mensaje);

            // Limpia el campo de nueva contraseña del formulario principal.
            document.getElementById('contrasena').value = '';

        } catch (error) {

            // Muestra un mensaje si ocurre un error de comunicación.
            mensaje.textContent =
                'No fue posible actualizar la contraseña.';

            modal.hidden = false;
        }
    });
});