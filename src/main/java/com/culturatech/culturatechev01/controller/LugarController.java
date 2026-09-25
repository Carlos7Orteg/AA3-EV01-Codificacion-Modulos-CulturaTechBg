/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
*/
package com.culturatech.culturatechev01.controller;

// Clases y anotaciones utilizadas para implementar el controlador REST.
import com.culturatech.culturatechev01.model.Lugar;
import com.culturatech.culturatechev01.repository.LugarRepository;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

/**
 * Controlador REST para gestionar los lugares de los eventos.
 * Permite realizar las operaciones CRUD mediante Spring Boot.
 */
@RestController
@RequestMapping("/api/lugares")
public class LugarController {

    // Repositorio utilizado para acceder a los datos de los lugares.
    private final LugarRepository lugarRepository;

    /**
     * Constructor que recibe el repositorio mediante inyección de dependencias.
     *
     * @param lugarRepository repositorio de lugares.
     */
    public LugarController(LugarRepository lugarRepository) {
        this.lugarRepository = lugarRepository;
    }

    /**
     * Consulta todos los lugares registrados.
     *
     * @return lista de lugares.
     */
    @GetMapping
    public List<Lugar> listar() {
        return lugarRepository.findAll();
    }

    /**
     * Consulta un lugar mediante su identificador.
     *
     * @param id identificador del lugar.
     * @return lugar encontrado.
     */
    @GetMapping("/{id}")
    public Lugar buscar(@PathVariable Integer id) {
        return lugarRepository.findById(id).orElse(null);
    }

    /**
     * Registra un nuevo lugar.
     *
     * @param lugar datos del lugar.
     * @return lugar registrado.
     */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Lugar lugar) {

        // Normaliza los datos principales del lugar antes de comparar.
        String nombre = normalizarTexto(lugar.getNombreLugar());
        String direccion = normalizarTexto(lugar.getDireccion());

        // Consulta los lugares existentes para comprobar posibles duplicados.
        List<Lugar> lugares = lugarRepository.findAll();

        for (Lugar existente : lugares) {

            // Compara nombre, localidad y dirección normalizados.
            if (normalizarTexto(existente.getNombreLugar()).equals(nombre)
                    && normalizarTexto(existente.getDireccion()).equals(direccion)) {

                // Rechaza el registro si ya existe un lugar equivalente.
                return ResponseEntity.badRequest()
                        .body("Ya existe un lugar registrado con el mismo nombre y dirección.");
            }
        }

        // Guarda el lugar cuando no se encuentra un duplicado.
        return ResponseEntity.ok(lugarRepository.save(lugar));
    }
    
    // Normaliza un texto para facilitar la comparación de direcciones.
    private String normalizarTexto(String texto) {

        if (texto == null) {
            return "";
        }

        return texto
                .toLowerCase()
                .replace("bogotá", "")
                .replace("bogota", "")
                .replace("colombia", "")
                .replace("no.", "")
                .replace("no", "")
                .replaceAll("[^a-z0-9]", "");
    }

    /**
     * Actualiza un lugar existente.
     *
     * @param id identificador del lugar.
     * @param lugar datos actualizados.
     * @return lugar actualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @RequestBody Lugar lugar) {

        // Normaliza el nombre y la dirección para comprobar duplicados.
        String nombre = normalizarTexto(lugar.getNombreLugar());
        String direccion = normalizarTexto(lugar.getDireccion());

        // Consulta los lugares existentes.
        List<Lugar> lugares = lugarRepository.findAll();

        for (Lugar existente : lugares) {

            // Ignora el mismo registro que se está actualizando.
            if (existente.getIdLugar().equals(id)) {
                continue;
            }

            // Rechaza la actualización si coincide nombre y dirección.
            if (normalizarTexto(existente.getNombreLugar()).equals(nombre)
                    && normalizarTexto(existente.getDireccion()).equals(direccion)) {

                return ResponseEntity.badRequest()
                        .body("Ya existe un lugar registrado con el mismo nombre y dirección.");
            }
        }

        // Asigna el identificador y actualiza el registro.
        lugar.setIdLugar(id);

        return ResponseEntity.ok(lugarRepository.save(lugar));
    }
    
     /**
     * Elimina un lugar existente mediante su identificador.
     *
     * @param id identificador del lugar que se desea eliminar.
     * @return respuesta de la operación de eliminación.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {

        // Verifica que el lugar exista antes de intentar eliminarlo.
        if (!lugarRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Elimina el lugar utilizando su identificador.
        lugarRepository.deleteById(id);

        // Confirma que la eliminación se realizó correctamente.
        return ResponseEntity.ok(
                "Lugar eliminado correctamente."
        );
    }
}
