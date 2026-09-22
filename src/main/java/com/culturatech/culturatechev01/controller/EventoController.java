/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.culturatech.culturatechev01.controller;

// Clases y anotaciones utilizadas para implementar el controlador REST.
import com.culturatech.culturatechev01.Evento;
import com.culturatech.culturatechev01.repository.EventoRepository;
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
 * Controlador REST del módulo de eventos.
 * Permite gestionar las operaciones CRUD mediante Spring Boot.
 */

@RestController
@RequestMapping("/api/eventos")
public class EventoController {
    
    // Repositorio utilizado para acceder a los datos de los eventos.
    private final EventoRepository eventoRepository;

    // Inyección de dependencia del repositorio.
    public EventoController(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }
    
    // Consulta y devuelve todos los eventos registrados en la base de datos.
    @GetMapping
    public List<Evento> listar() {
        return eventoRepository.findAll();
    }
    
    // Consulta un evento por su identificador.
    @GetMapping("/{id}")
    public Evento buscar(@PathVariable Integer id) {
        return eventoRepository.findById(id).orElse(null);
    }
    
    // Crea un nuevo evento y lo guarda en la base de datos.
    @PostMapping
    public Evento crear(@RequestBody Evento evento) {
        return eventoRepository.save(evento);
    }
    
    // Actualiza un evento existente según su identificador.
    @PutMapping("/{id}")
    public Evento actualizar(@PathVariable Integer id, @RequestBody Evento evento) {
        evento.setIdEvento(id);
        return eventoRepository.save(evento);
    }
    
    // Elimina un evento existente según su identificador.
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        eventoRepository.deleteById(id);
    }
}

