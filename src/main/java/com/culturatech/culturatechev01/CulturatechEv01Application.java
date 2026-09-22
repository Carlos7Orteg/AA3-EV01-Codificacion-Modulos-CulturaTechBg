package com.culturatech.culturatechev01;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación CulturaTech Bogotá.
 * Inicia el proyecto Spring Boot y activa su configuración automática.
 */
@SpringBootApplication
public class CulturatechEv01Application {
    
        /**
        * Punto de entrada de la aplicación.
        * 
        * @param args argumentos recibidos al iniciar la aplicación.
        */
	public static void main(String[] args) {
		SpringApplication.run(CulturatechEv01Application.class, args);
	}
}
