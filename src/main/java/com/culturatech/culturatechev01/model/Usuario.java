/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.culturatech.culturatechev01.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * Entidad que representa un usuario del sistema CulturaTech Bogotá.
 * Se encuentra asociada a la tabla usuario de la base de datos.
 */
@Entity
@Table(name = "usuario")
public class Usuario {

    // Identificador único del usuario.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    // Nombres del usuario.
    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    // Apellidos del usuario.
    @Column(name = "apellidos", nullable = false, length = 100)
    private String apellidos;

    // Documento único de identificación del usuario.
    @Column(name = "documento", nullable = false, unique = true, length = 20)
    private String documento;

    // Fecha de nacimiento del usuario.
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    // Correo electrónico utilizado para el inicio de sesión.
    @Column(name = "correo", nullable = false, unique = true, length = 150)
    private String correo;

    // Contraseña almacenada para la autenticación del usuario.
    @Column(name = "contraseña", nullable = false, length = 255)
    @JsonIgnore
    private String contrasena;

    // Rol asignado al usuario dentro del sistema.
    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol;

    // Getters y setters para acceder y modificar los atributos de la entidad.
    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}