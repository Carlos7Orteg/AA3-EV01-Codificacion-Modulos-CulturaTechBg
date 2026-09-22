/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.culturatech.culturatechev01.controller;

// Clases y anotaciones utilizadas para implementar el controlador REST.
import com.culturatech.culturatechev01.model.Categoria;
import com.culturatech.culturatechev01.repository.CategoriaRepository;
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
 * Controlador REST para gestionar las categorías de eventos.
 * Permite realizar las operaciones CRUD mediante Spring Boot.
 */
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    // Repositorio utilizado para acceder a los datos de las categorías.
    private final CategoriaRepository categoriaRepository;

    /**
     * Constructor que recibe el repositorio mediante inyección de dependencias.
     *
     * @param categoriaRepository repositorio de categorías.
     */
    public CategoriaController(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Consulta todas las categorías registradas.
     *
     * @return lista de categorías.
     */
    @GetMapping
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    /**
     * Consulta una categoría mediante su identificador.
     *
     * @param id identificador de la categoría.
     * @return categoría encontrada.
     */
    @GetMapping("/{id}")
    public Categoria buscar(@PathVariable Integer id) {
        return categoriaRepository.findById(id).orElse(null);
    }

    /**
     * Registra una nueva categoría.
     *
     * @param categoria datos de la categoría.
     * @return categoría registrada.
     */
    @PostMapping
    public Categoria crear(@RequestBody Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    /**
     * Actualiza una categoría existente.
     *
     * @param id identificador de la categoría.
     * @param categoria datos actualizados.
     * @return categoría actualizada.
     */
    @PutMapping("/{id}")
    public Categoria actualizar(
            @PathVariable Integer id,
            @RequestBody Categoria categoria) {

        // Asigna el identificador recibido en la URL al objeto actualizado.
        categoria.setIdCategoria(id);

        return categoriaRepository.save(categoria);
    }

    /**
     * Elimina una categoría mediante su identificador.
     *
     * @param id identificador de la categoría.
     */
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        categoriaRepository.deleteById(id);
    }
}