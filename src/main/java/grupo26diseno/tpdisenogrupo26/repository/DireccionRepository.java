package grupo26diseno.tpdisenogrupo26.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Direccion;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    
    Optional<Direccion> findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
        String nombreCalle, 
        int numCalle, 
        String localidad, 
        String codPostal, 
        String provincia, 
        String pais
    );
}