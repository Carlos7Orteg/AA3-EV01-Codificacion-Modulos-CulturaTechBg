/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.culturatech.culturatechev01.repository;

import com.culturatech.culturatechev01.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio para gestionar los datos de la entidad Categoria.
 * Spring Data JPA proporciona las operaciones de acceso a datos.
 */
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}