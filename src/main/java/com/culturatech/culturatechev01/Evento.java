/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.culturatech.culturatechev01;

// Importaciones de las clases y anotaciones utilizadas para mapear la entidad Evento con la base de datos y sus relaciones.
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import com.culturatech.culturatechev01.model.Categoria;
import com.culturatech.culturatechev01.model.Lugar;


/**
 * Entidad que representa los eventos registrados en la plataforma.
 * Su estructura se encuentra relacionada con la tabla evento de MySQL.
 */
@Entity
@Table(name= "evento")
public class Evento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    
    // Identificador único del evento generado automáticamente por la base de datos.
    private Integer idEvento;
    @Column(name = "titulo", nullable = false, length = 150)
    
    // Título que identifica el evento dentro de la plataforma.
    private String titulo;
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;
    @Column(name = "costo", precision = 10, scale = 2)
    private BigDecimal costo;
    @Column(name = "imagen", columnDefinition = "TEXT")
    private String imagen;
    @Column(name = "estado")
    private String estado;
    
    // Relación muchos a uno: varios eventos pueden pertenecer a una misma categoría.
    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;
    
    // Relación muchos a uno: varios eventos pueden realizarse en un mismo lugar.
    @ManyToOne
    @JoinColumn(name = "id_lugar", nullable = false)
    private Lugar lugar;
    
    // Métodos de acceso para consultar y modificar los atributos de la entidad.
    /**
    * Obtiene el identificador del evento.
    * @return identificador del evento.
    */
    public Integer getIdEvento() {
        return idEvento;
    }

    /**
    * Establece el identificador del evento.
    * @param idEvento identificador del evento.
    */
    public void setIdEvento(Integer idEvento) {
        this.idEvento = idEvento;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public BigDecimal getCosto() {
        return costo;
    }

    public void setCosto(BigDecimal costo) {
        this.costo = costo;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Categoria getCategoria() {
        return categoria;
    }
    
    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Lugar getLugar() {
        return lugar;
    }

    public void setLugar(Lugar lugar) {
        this.lugar = lugar;
    }
    
}
