package grupo26diseno.tpdisenogrupo26.service;



public interface UsuarioService {
    /**
     * Verifica si las credenciales ingresadas corresponden a un usuario válido.
     * @param unNombre Nombre de usuario a validar.
     * @param unaContra Contraseña a validar.
     * @return true si las credenciales son correctas, false en caso contrario.
     */
    boolean autenticarUsuario (String unNombre, String unaContra);
}
