package grupo26diseno.tpdisenogrupo26.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Usuario;

@Repository
public interface UsuarioRepository  extends JpaRepository<Usuario, Long> {
    /**
     * Valida las credenciales de un usuario buscando coincidencia exacta de nombre y contraseña.
     * @param nombre Nombre del usuario.
     * @param contra Contraseña del usuario.
     * @return Optional con el usuario si las credenciales son correctas, o vacío si fallan.
     */
    Optional<Usuario> findByNombreAndContra(String nombre, String contra);
    /**
     * Busca un usuario por su nombre.
     * @param nombre Nombre del usuario a buscar.
     * @return Optional con el usuario si existe.
     */
    Optional<Usuario> findByNombre(String nombre);
}