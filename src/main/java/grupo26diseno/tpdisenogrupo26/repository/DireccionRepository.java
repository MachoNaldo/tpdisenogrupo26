package grupo26diseno.tpdisenogrupo26.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Direccion;

@Repository
public interface DireccionRepository extends JpaRepository<Direccion, Long> {
    /**
     * Busca una dirección coincidiendo con todos sus campos.
     * @param nombreCalle Nombre de la calle
     * @param numCalle Número de la calle
     * @param localidad Ciudad o Localidad
     * @param codPostal Código postal
     * @param provincia Provincia
     * @param pais País
     * @return Una dirección que coincida con los parámetros dados, o vacío si no existe.
     */
    Optional<Direccion> findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
        String nombreCalle, 
        int numCalle, 
        String localidad, 
        String codPostal, 
        String provincia, 
        String pais
    );
}