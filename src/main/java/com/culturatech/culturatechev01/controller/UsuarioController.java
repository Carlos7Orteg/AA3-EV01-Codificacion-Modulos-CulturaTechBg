/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.culturatech.culturatechev01.controller;

// Clases y anotaciones utilizadas para implementar el controlador REST.
import com.culturatech.culturatechev01.model.Usuario;
import com.culturatech.culturatechev01.repository.UsuarioRepository;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.culturatech.culturatechev01.model.Rol;
import com.culturatech.culturatechev01.util.PasswordUtil;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.springframework.http.ResponseEntity;

/**
 * Controlador REST para gestionar los usuarios del sistema.
 * Permite realizar las operaciones CRUD mediante Spring Boot.
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    // Repositorio utilizado para acceder a los datos de los usuarios.
    private final UsuarioRepository usuarioRepository;

    /**
     * Constructor que recibe el repositorio mediante inyección de dependencias.
     *
     * @param usuarioRepository repositorio de usuarios.
     */
    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Consulta todos los usuarios registrados.
     *
     * @return lista de usuarios.
     */
    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    /**
     * Consulta un usuario mediante su identificador.
     *
     * @param id identificador del usuario.
     * @return usuario encontrado.
     */
    @GetMapping("/{id}")
    public Usuario buscar(@PathVariable Integer id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    /**
     * Registra un nuevo usuario.
     *
     * @param usuario datos del usuario.
     * @return usuario registrado.
     */
    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    /**
     * Actualiza los datos de un usuario existente y aplica las validaciones de
     * seguridad según el usuario que realiza la operación.
     *
     * @param id identificador del usuario que se desea actualizar.
     * @param solicitud datos del usuario y credenciales de seguridad.
     * @param session sesión del usuario autenticado.
     * @return respuesta con el resultado de la actualización.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @RequestBody UsuarioActualizacionRequest solicitud,
            HttpSession session) {

        // Obtiene de la sesión el identificador del usuario que realiza la acción.
        Integer administradorId = (Integer) session.getAttribute("usuarioId");

        // Verifica que exista una sesión autenticada.
        if (administradorId == null) {
            return ResponseEntity.status(401)
                    .body(Map.of(
                            "ok", false,
                            "mensaje", "Sesión no válida."
                    ));
        }

        // Consulta el usuario que realiza la operación.
        Usuario administrador = usuarioRepository.findById(administradorId)
                .orElse(null);

        // Verifica que el usuario autenticado tenga rol ADMIN.
        if (administrador == null || administrador.getRol() != Rol.ADMIN) {
            return ResponseEntity.status(403)
                    .body(Map.of(
                            "ok", false,
                            "mensaje", "No tiene permisos para realizar esta operación."
                    ));
        }

        // Consulta el usuario que será modificado.
        Usuario existente = usuarioRepository.findById(id)
                .orElse(null);

        if (existente == null) {
            return ResponseEntity.status(404)
                    .body(Map.of(
                            "ok", false,
                            "mensaje", "Usuario no encontrado."
                    ));
        }

        // Determina si el administrador está modificando su propio usuario.
        boolean esPropioUsuario = administradorId.equals(id);

        /*
     * Cuando un ADMIN modifica a otro ADMIN se solicita la contraseña
     * del administrador que está realizando la operación.
         */
        if (!esPropioUsuario && existente.getRol() == Rol.ADMIN) {

            if (solicitud.getContrasenaSeguridad() == null
                    || solicitud.getContrasenaSeguridad().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "ok", false,
                                "mensaje", "Debe proporcionar la contraseña de seguridad."
                        ));
            }

            // Verifica la contraseña actual del administrador que realiza la acción.
            if (!PasswordUtil.verificar(
                    solicitud.getContrasenaSeguridad(),
                    administrador.getContrasena())) {

                return ResponseEntity.status(403)
                        .body(Map.of(
                                "ok", false,
                                "mensaje", "La contraseña de seguridad es incorrecta."
                        ));
            }
        }

        /*
     * Si el administrador está modificando su propia contraseña,
     * se exige contraseña actual, nueva contraseña y confirmación.
         */
        if (esPropioUsuario) {

            boolean solicitaCambioContrasena
                    = (solicitud.getContrasenaActual() != null
                    && !solicitud.getContrasenaActual().isBlank())
                    || (solicitud.getNuevaContrasena() != null
                    && !solicitud.getNuevaContrasena().isBlank())
                    || (solicitud.getConfirmarContrasena() != null
                    && !solicitud.getConfirmarContrasena().isBlank());

            if (solicitaCambioContrasena) {

                if (solicitud.getContrasenaActual() == null
                        || solicitud.getContrasenaActual().isBlank()
                        || solicitud.getNuevaContrasena() == null
                        || solicitud.getNuevaContrasena().isBlank()
                        || solicitud.getConfirmarContrasena() == null
                        || solicitud.getConfirmarContrasena().isBlank()) {

                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "ok", false,
                                    "mensaje", "Debe proporcionar la contraseña actual, la nueva contraseña y su confirmación."
                            ));
                }

                // Verifica la contraseña actual del administrador.
                if (!PasswordUtil.verificar(
                        solicitud.getContrasenaActual(),
                        existente.getContrasena())) {

                    return ResponseEntity.status(403)
                            .body(Map.of(
                                    "ok", false,
                                    "mensaje", "La contraseña actual es incorrecta."
                            ));
                }

                // Verifica que la nueva contraseña y su confirmación coincidan.
                if (!solicitud.getNuevaContrasena()
                        .equals(solicitud.getConfirmarContrasena())) {

                    return ResponseEntity.badRequest()
                            .body(Map.of(
                                    "ok", false,
                                    "mensaje", "La nueva contraseña y su confirmación no coinciden."
                            ));
                }

                // Genera el nuevo hash antes de almacenarlo.
                existente.setContrasena(
                        PasswordUtil.generarHash(
                                solicitud.getNuevaContrasena()
                        )
                );
            }
        }

        // Actualiza los datos generales del usuario.
        existente.setNombres(solicitud.getUsuario().getNombres());
        existente.setApellidos(solicitud.getUsuario().getApellidos());
        existente.setDocumento(solicitud.getUsuario().getDocumento());
        existente.setFechaNacimiento(
                solicitud.getUsuario().getFechaNacimiento()
        );
        existente.setCorreo(solicitud.getUsuario().getCorreo());
        existente.setRol(solicitud.getUsuario().getRol());

        /*
     * Para otro usuario, una contraseña nueva solo se actualiza
     * cuando el formulario la proporciona.
         */
        if (!esPropioUsuario
                && solicitud.getUsuario().getContrasena() != null
                && !solicitud.getUsuario().getContrasena().isBlank()) {

            existente.setContrasena(
                    PasswordUtil.generarHash(
                            solicitud.getUsuario().getContrasena()
                    )
            );
        }

        return ResponseEntity.ok(usuarioRepository.save(existente));
    }
    
    /**
     * Estructura utilizada para recibir los datos del usuario junto con las
     * credenciales necesarias para las operaciones de seguridad.
     */
    public static class UsuarioActualizacionRequest {

        private Usuario usuario;
        private String contrasenaSeguridad;
        private String contrasenaActual;
        private String nuevaContrasena;
        private String confirmarContrasena;

        public Usuario getUsuario() {
            return usuario;
        }

        public void setUsuario(Usuario usuario) {
            this.usuario = usuario;
        }

        public String getContrasenaSeguridad() {
            return contrasenaSeguridad;
        }

        public void setContrasenaSeguridad(String contrasenaSeguridad) {
            this.contrasenaSeguridad = contrasenaSeguridad;
        }

        public String getContrasenaActual() {
            return contrasenaActual;
        }

        public void setContrasenaActual(String contrasenaActual) {
            this.contrasenaActual = contrasenaActual;
        }

        public String getNuevaContrasena() {
            return nuevaContrasena;
        }

        public void setNuevaContrasena(String nuevaContrasena) {
            this.nuevaContrasena = nuevaContrasena;
        }

        public String getConfirmarContrasena() {
            return confirmarContrasena;
        }

        public void setConfirmarContrasena(String confirmarContrasena) {
            this.confirmarContrasena = confirmarContrasena;
        }
    }
    
     /**
     * Elimina un usuario existente mediante su identificador.
     *
     * @param id identificador del usuario que se desea eliminar.
     * @return respuesta de la operación de eliminación.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {

        // Verifica que el usuario exista antes de intentar eliminarlo.
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Elimina el usuario utilizando su identificador.
        usuarioRepository.deleteById(id);

        // Confirma que la eliminación se realizó correctamente.
        return ResponseEntity.ok(
                "Usuario eliminado correctamente."
        );
    }
}
