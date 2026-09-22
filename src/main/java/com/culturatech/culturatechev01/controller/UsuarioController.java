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
     * Actualiza los datos de un usuario existente.
     *
     * @param id identificador del usuario.
     * @param usuario datos actualizados.
     * @return usuario actualizado.
     */
    @PutMapping("/{id}")
    public Usuario actualizar(
            @PathVariable Integer id,
            @RequestBody Usuario usuario) {

        // Asigna el identificador recibido en la URL al objeto actualizado.
        usuario.setIdUsuario(id);

        return usuarioRepository.save(usuario);
    }

    /**
     * Elimina un usuario mediante su identificador.
     *
     * @param id identificador del usuario.
     */
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        usuarioRepository.deleteById(id);
    }
}