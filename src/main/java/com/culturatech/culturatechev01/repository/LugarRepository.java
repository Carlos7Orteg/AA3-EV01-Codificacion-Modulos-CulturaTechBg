/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.culturatech.culturatechev01.repository;

import com.culturatech.culturatechev01.model.Lugar;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para gestionar los datos de la entidad Lugar.
 * Spring Data JPA proporciona las operaciones de acceso a datos.
 */
public interface LugarRepository extends JpaRepository<Lugar, Integer> {

    // Comprueba si ya existe un lugar con el mismo nombre y localidad.
    boolean existsByNombreLugarIgnoreCaseAndLocalidadIgnoreCase(String nombreLugar, String localidad);

    // Comprueba si existe otro lugar con el mismo nombre y localidad al actualizar, excluyendo el registro actual.
    boolean existsByNombreLugarIgnoreCaseAndLocalidadIgnoreCaseAndIdLugarNot(
            String nombreLugar,
            String localidad,
            Integer idLugar
    );
}