-- Convierte en administrador a un usuario previamente registrado en CulturaTech Bogotá.
-- Reemplace CORREO_DEL_ADMIN_AQUI por el correo del usuario que se registró desde la aplicación.

USE culturatechbg;

UPDATE usuario
SET rol = 'ADMIN'
WHERE correo = 'CORREO_DEL_ADMIN_AQUI';

-- Verifica el rol asignado al usuario.
SELECT id_usuario, nombres, apellidos, correo, rol
FROM usuario
WHERE correo = 'CORREO_DEL_ADMIN_AQUI';
