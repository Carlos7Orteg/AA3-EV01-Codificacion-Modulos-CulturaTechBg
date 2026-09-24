/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.culturatech.culturatechev01.util;

// Clases utilizadas para realizar la verificación y comparación de contraseñas.
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.GeneralSecurityException;
import java.util.Base64;
import java.security.SecureRandom;

/**
 * Utilidad para verificar contraseñas almacenadas mediante PBKDF2.
 */
public class PasswordUtil {

    /**
    * Verifica una contraseña utilizando el algoritmo PBKDF2 con HmacSHA256
    * y compara el resultado con el hash almacenado.
    */
    public static boolean verificar(String contrasena, String almacenada) {

        try {
            String[] partes = almacenada.split(":");

            int iteraciones = Integer.parseInt(partes[0]);
            byte[] salt = Base64.getDecoder().decode(partes[1]);
            byte[] hashEsperado = Base64.getDecoder().decode(partes[2]);

            PBEKeySpec spec = new PBEKeySpec(
                    contrasena.toCharArray(),
                    salt,
                    iteraciones,
                    hashEsperado.length * 8
            );

            SecretKeyFactory factory =
                    SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

            byte[] hashCalculado = factory.generateSecret(spec).getEncoded();

            return java.security.MessageDigest.isEqual(
                    hashEsperado,
                    hashCalculado
            );

        } catch (GeneralSecurityException | IllegalArgumentException e) {
            return false;
        }
    }
    
    /**
     * Genera el hash de una contraseña utilizando PBKDF2 con HmacSHA256.
     *
     * @param contrasena contraseña que se desea proteger.
     * @return contraseña con iteraciones, salt y hash en formato almacenado.
     */
    public static String generarHash(String contrasena) {

        try {
            int iteraciones = 120000;
            byte[] salt = new byte[16];

            new SecureRandom().nextBytes(salt);

            PBEKeySpec spec = new PBEKeySpec(
                    contrasena.toCharArray(),
                    salt,
                    iteraciones,
                    256
            );

            SecretKeyFactory factory
                    = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

            byte[] hash = factory.generateSecret(spec).getEncoded();

            return iteraciones + ":"
                    + Base64.getEncoder().encodeToString(salt) + ":"
                    + Base64.getEncoder().encodeToString(hash);

        } catch (GeneralSecurityException e) {
            throw new IllegalStateException(
                    "No fue posible generar el hash de la contraseña.",
                    e
            );
        }
    }
}