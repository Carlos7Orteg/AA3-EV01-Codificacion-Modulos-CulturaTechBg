/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.culturatech.culturatechev01.repository;

import com.culturatech.culturatechev01.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para gestionar los datos de la entidad Evento.
 * Spring Data JPA proporciona las operaciones CRUD mediante JpaRepository.
 */
public interface EventoRepository extends JpaRepository<Evento, Integer> {
    
}
