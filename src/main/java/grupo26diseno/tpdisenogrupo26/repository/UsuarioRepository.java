package grupo26diseno.tpdisenogrupo26.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Usuario;

@Repository
public interface UsuarioRepository  extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNombreAndContra(String nombre, String contra);
    Optional<Usuario> findByNombre(String nombre);
}