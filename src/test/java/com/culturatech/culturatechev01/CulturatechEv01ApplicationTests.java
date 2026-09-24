package com.culturatech.culturatechev01;

// Clases y anotaciones utilizadas para realizar la prueba del contexto de Spring Boot.
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

// Clase utilizada para probar la generación y validación de contraseñas.
import com.culturatech.culturatechev01.util.PasswordUtil;

// Métodos de aserción utilizados para validar los resultados de las pruebas.
import static org.junit.jupiter.api.Assertions.*;

/**
 * Prueba la carga del contexto principal de la aplicación Spring Boot.
 */
@SpringBootTest
class CulturatechEv01ApplicationTests {

        /**
        * Verifica que el contexto de la aplicación pueda iniciarse correctamente.
        */
	@Test
	void contextLoads() {
	}
        
            /**
     * Verifica que al generar un hash no se almacene la contraseña en texto plano.
     */
    @Test
    void generarHashNoGuardaContrasenaEnTextoPlano() {
        String contrasena = "Yo3ky8!MotRE%";
        String hash = PasswordUtil.generarHash(contrasena);

        // El hash generado no debe ser igual a la contraseña original.
        assertNotEquals(contrasena, hash);
    }

    /**
     * Verifica que una contraseña correcta pueda validarse contra su hash.
     */
    @Test
    void verificarAceptaContrasenaCorrecta() {
        String contrasena = "Yo3ky8!MotRE%";
        String hash = PasswordUtil.generarHash(contrasena);

        // La contraseña original debe ser validada correctamente.
        assertTrue(PasswordUtil.verificar(contrasena, hash));
    }

    /**
     * Verifica que una contraseña incorrecta sea rechazada.
     */
    @Test
    void verificarRechazaContrasenaIncorrecta() {
        String contrasena = "Yo3ky8!MotRE%";
        String contrasenaIncorrecta = "ClaveIncorrecta123!";
        String hash = PasswordUtil.generarHash(contrasena);

        // Una contraseña diferente no debe coincidir con el hash almacenado.
        assertFalse(PasswordUtil.verificar(contrasenaIncorrecta, hash));
    }
}
