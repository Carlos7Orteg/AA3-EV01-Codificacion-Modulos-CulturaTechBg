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
     */
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(
            @RequestBody Map<String, String> datos,
            HttpSession session) {

        // Obtiene el identificador del usuario autenticado.
        Integer usuarioId = (Integer) session.getAttribute("usuarioId");

        if (usuarioId == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("ok", false, "mensaje", "Sesión no autenticada."));
        }

        String contrasenaActual = datos.get("contrasenaActual");
        String nuevaContrasena = datos.get("nuevaContrasena");
        String confirmarContrasena = datos.get("confirmarContrasena");

        // Verifica que se hayan enviado las credenciales necesarias.
        if (contrasenaActual == null
                || nuevaContrasena == null
                || confirmarContrasena == null
                || contrasenaActual.isBlank()
                || nuevaContrasena.isBlank()
                || confirmarContrasena.isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "ok", false,
                            "mensaje", "Todos los campos de contraseña son obligatorios."
                    ));
        }

        // Consulta el usuario autenticado.
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);

        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        // Comprueba la contraseña actual.
        if (!PasswordUtil.verificar(
                contrasenaActual,
                usuario.getContrasena())) {

            return ResponseEntity.status(400)
                    .body(Map.of(
                            "ok", false,
                            "mensaje", "La contraseña actual es incorrecta."
                    ));
        }

        // Verifica que la nueva contraseña y su confirmación coincidan.
        if (!nuevaContrasena.equals(confirmarContrasena)) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "ok", false,
                            "mensaje", "La nueva contraseña y su confirmación no coinciden."
                    ));
        }

        // Genera y almacena el nuevo hash de contraseña.
        usuario.setContrasena(
                PasswordUtil.generarHash(nuevaContrasena)
        );

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(
                Map.of(
                        "ok", true,
                        "mensaje", "La contraseña fue actualizada correctamente."
                )
        );
    }
}