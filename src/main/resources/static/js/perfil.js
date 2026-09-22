/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

// Ejecuta la carga de información cuando el documento HTML termina de cargarse.
document.addEventListener('DOMContentLoaded', async () => {

    // Solicita al backend los datos del usuario autenticado.
    const response = await fetch('/api/auth/perfil');

    // Si el usuario no está autenticado o el servidor devuelve un error,
    // se redirige a la página de inicio de sesión.
    if (!response.ok) {
        window.location.replace('/pages/login.html');
        return;
    }

    // Convierte la respuesta del servidor desde JSON a un objeto JavaScript.
    const usuario = await response.json();

    // Carga los datos del usuario en los campos correspondientes del formulario.
    document.getElementById('nombres').value = usuario.nombres || '';
    document.getElementById('apellidos').value = usuario.apellidos || '';
    document.getElementById('documento').value = usuario.documento || '';
    document.getElementById('fechaNacimiento').value = usuario.fechaNacimiento || '';
    document.getElementById('correo').value = usuario.correo || '';
});
