/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.culturatech.culturatechev01.controller;

import com.culturatech.culturatechev01.model.Usuario;
import com.culturatech.culturatechev01.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.culturatech.culturatechev01.util.PasswordUtil;
import jakarta.servlet.http.HttpSession;

import java.util.Map;

/**
 * Controlador para gestionar la autenticación de usuarios.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Valida las credenciales recibidas desde el formulario de login.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> datos, HttpSession session) {    

        String correo = datos.get("correo");
        String contrasena = datos.get("contrasena");

        Usuario usuario = usuarioRepository.findByCorreo(correo);

        if (usuario == null || !PasswordUtil.verificar(contrasena, usuario.getContrasena())) {
            return ResponseEntity.status(401)
                    .body(Map.of("ok", false, "mensaje", "Credenciales incorrectas."));
        }
        
        // Guarda en sesión el identificador del usuario autenticado.
        session.setAttribute("usuarioId", usuario.getIdUsuario());

        return ResponseEntity.ok(Map.of("ok", true, "usuario", usuario));
    }
    
    // Consulta los datos del usuario autenticado para mostrar su perfil.
    @GetMapping("/perfil")
    public ResponseEntity<?> perfil(HttpSession session) {
    
        // Obtiene de la sesión el identificador del usuario autenticado.
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");

        // Si no existe una sesión de usuario, se informa que no está autenticado.
        if (usuarioId == null) {
            return ResponseEntity.status(401).build();
        }

        // Consulta en la base de datos el usuario correspondiente a la sesión.
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);

        // Si el usuario no existe, devuelve una respuesta de recurso no encontrado.
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        // Devuelve los datos del usuario en formato JSON.
        return ResponseEntity.ok(usuario);
    }
    
    /**
     * Actualiza la contraseña del usuario autenticado desde su perfil.
     *
     * @param datos datos de contraseña enviados desde el formulario.
     * @param session sesión del usuario autenticado.
     * @return resultado de la actualización.
     */
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(
            @RequestBody Map<String, String> datos,
            HttpSession session) {

        // Obtiene el identificador del usuario autenticado.
        Integer usuarioId
                = (Integer) session.getAttribute("usuarioId");

        // Verifica que exista una sesión autenticada.
        if (usuarioId == null) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "ok", false,
                            "mensaje", "Sesión no autenticada."
                    ));
        }

        // Obtiene las contraseñas enviadas desde el modal.
        String contrasenaActual
                = datos.get("contrasenaActual");

        String nuevaContrasena
                = datos.get("nuevaContrasena");

        String confirmarContrasena
                = datos.get("confirmarContrasena");

        // Verifica que los tres campos sean obligatorios.
        if (contrasenaActual == null
                || nuevaContrasena == null
                || confirmarContrasena == null
                || contrasenaActual.isBlank()
                || nuevaContrasena.isBlank()
                || confirmarContrasena.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "ok", false,
                            "mensaje",
                            "Todos los campos de contraseña son obligatorios."
                    ));
        }

        // Busca el usuario autenticado en la base de datos.
        Usuario usuario
                = usuarioRepository.findById(usuarioId)
                        .orElse(null);

        // Verifica que el usuario exista.
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        // Comprueba que la contraseña actual sea correcta.
        if (!PasswordUtil.verificar(
                contrasenaActual,
                usuario.getContrasena())) {

            return ResponseEntity.status(400)
                    .body(Map.of(
                            "ok", false,
                            "mensaje",
                            "La contraseña actual es incorrecta."
                    ));
        }

        // Comprueba que la nueva contraseña y su confirmación coincidan.
        if (!nuevaContrasena.equals(confirmarContrasena)) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "ok", false,
                            "mensaje",
                            "La nueva contraseña y su confirmación no coinciden."
                    ));
        }

        // Genera el hash de la nueva contraseña.
        usuario.setContrasena(
                PasswordUtil.generarHash(nuevaContrasena)
        );

        // Guarda la nueva contraseña en la base de datos.
        usuarioRepository.save(usuario);

        // Confirma que la actualización fue exitosa.
        return ResponseEntity.ok(
                Map.of(
                        "ok", true,
                        "mensaje",
                        "La contraseña fue actualizada correctamente."
                )
        );
    }
    
    /**
     * Actualiza los datos personales del usuario autenticado.
     *
     * @param datos datos personales enviados desde el formulario.
     * @param session sesión del usuario autenticado.
     * @return resultado de la actualización.
     */
    @PutMapping("/perfil/datos")
    public ResponseEntity<?> actualizarDatosPerfil(
            @RequestBody Map<String, String> datos,
            HttpSession session) {

        // Obtiene el identificador del usuario autenticado.
        Integer usuarioId
                = (Integer) session.getAttribute("usuarioId");

        // Verifica que exista una sesión autenticada.
        if (usuarioId == null) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "ok", false,
                            "mensaje", "Sesión no válida."
                    ));
        }

        // Busca el usuario en la base de datos.
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElse(null);

        // Verifica que el usuario exista.
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        // Actualiza los datos personales recibidos.
        usuario.setNombres(datos.get("nombres"));
        usuario.setApellidos(datos.get("apellidos"));
        usuario.setDocumento(datos.get("documento"));
        usuario.setFechaNacimiento(
                datos.get("fechaNacimiento") == null
                || datos.get("fechaNacimiento").isBlank()
                ? null
                : java.time.LocalDate.parse(
                        datos.get("fechaNacimiento")
                )
        );
        usuario.setCorreo(datos.get("correo"));

        // Guarda los cambios en la base de datos.
        usuarioRepository.save(usuario);

        // Confirma que la actualización fue correcta.
        return ResponseEntity.ok(
                Map.of(
                        "ok", true,
                        "mensaje",
                        "Datos del perfil actualizados correctamente."
                )
        );
    }
    
    /**
     * Elimina la cuenta del usuario autenticado.
     *
     * @param session sesión del usuario autenticado.
     * @return redirección hacia la página de inicio de sesión.
     */
    @PostMapping("/perfil/eliminar")
    public ResponseEntity<Void> eliminarCuenta(
            HttpSession session) {

        // Obtiene el identificador del usuario autenticado.
        Integer usuarioId
                = (Integer) session.getAttribute("usuarioId");

        // Verifica que exista una sesión válida.
        if (usuarioId == null) {
            return ResponseEntity.status(401).build();
        }

        // Verifica que el usuario exista.
        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        // Elimina el usuario de la base de datos.
        usuarioRepository.deleteById(usuarioId);

        // Cierra la sesión después de eliminar la cuenta.
        session.invalidate();

        // Redirige al usuario hacia el inicio de sesión.
        return ResponseEntity.status(302)
                .header("Location", "/pages/login.html")
                .build();
    }
}