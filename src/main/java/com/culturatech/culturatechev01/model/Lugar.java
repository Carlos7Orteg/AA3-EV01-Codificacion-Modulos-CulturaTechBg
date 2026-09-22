/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.culturatech.culturatechev01.model;

// Importaciones de las anotaciones JPA y tipos utilizados para mapear la entidad Lugar.
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

/**
 * Entidad que representa los lugares donde se realizan los eventos.
 * Sus datos se almacenan en la tabla lugar de la base de datos.
 */
@Entity
@Table(name = "lugar")
public class Lugar {
    
    // Datos principales del lugar, incluyendo ubicación, contacto y sitio web.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lugar")
    private Integer idLugar;
    
    @Column(name = "nombre_lugar", nullable = false, length = 150)
    private String nombreLugar;

    @Column(name = "direccion", length = 200)
    private String direccion;

    @Column(name = "localidad", length = 100)
    private String localidad;

    @Column(name = "latitud", precision = 10, scale = 8)
    private BigDecimal latitud;

    @Column(name = "longitud", precision = 11, scale = 8)
    private BigDecimal longitud;

    @Column(name = "telefono", length = 150)
    private String telefono;

    @Column(name = "pagina_web", length = 255)
    private String paginaWeb;

    // Métodos de acceso para consultar y modificar los datos del lugar.
    public Integer getIdLugar() {
        return idLugar;
    }

    public void setIdLugar(Integer idLugar) {
        this.idLugar = idLugar;
    }

    public String getNombreLugar() {
        return nombreLugar;
    }

    public void setNombreLugar(String nombreLugar) {
        this.nombreLugar = nombreLugar;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getLocalidad() {
        return localidad;
    }

    public void setLocalidad(String localidad) {
        this.localidad = localidad;
    }

    public BigDecimal getLatitud() {
        return latitud;
    }

    public void setLatitud(BigDecimal latitud) {
        this.latitud = latitud;
    }

    public BigDecimal getLongitud() {
        return longitud;
    }

    public void setLongitud(BigDecimal longitud) {
        this.longitud = longitud;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getPaginaWeb() {
        return paginaWeb;
    }

    public void setPaginaWeb(String paginaWeb) {
        this.paginaWeb = paginaWeb;
    }
    
}
