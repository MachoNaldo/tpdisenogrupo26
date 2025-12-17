package grupo26diseno.tpdisenogrupo26.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;



@Repository
public interface HuespedRepository  extends JpaRepository<Huesped, Long> {
    /**
     * Busca huéspedes por tipo y número de documento.
     * @param tipoDocumento Tipo de documento del huésped.
     * @param documentacion Número de documento del huésped.
     * @return Lista de huéspedes que coinciden con los criterios dados.
     */
    List<Huesped> findByTipoDocumentoAndDocumentacion(TipoDoc tipoDocumento, String documentacion);
    
    /**
     * Verifica si existe un huésped con el tipo y número de documento dados.
     * @param tipoDocumento Tipo de documento del huésped.
     * @param documentacion Número de documento del huésped.
     * @return true si existe un huésped con ese tipo y número de documento, false en caso contrario.
     */
    boolean existsByTipoDocumentoAndDocumentacion(TipoDoc tipoDocumento, String documentacion);


    /**
     * Realiza una búsqueda avanzada con filtros dinámicos (opcionales)
     * @param apellido Apellido del huésped.
     * @param nombres Nombres del huésped.
     * @param tipoDocumento Tipo de documento del huésped.
     * @param documentacion Número de documento del huésped.
     * @return Lista de huéspedes que cumplen con todos los criterios no nulos ingresados.
     */
     @Query("SELECT h FROM Huesped h WHERE " +
           "(:apellido IS NULL OR h.apellido LIKE %:apellido%) AND " +
           "(:nombres IS NULL OR h.nombres LIKE %:nombres%) AND " +
           "(:tipoDocumento IS NULL OR h.tipoDocumento = :tipoDocumento) AND " +
           "(:documentacion IS NULL OR h.documentacion = :documentacion)")
    List<Huesped> buscarPorCriterios(
            @Param("apellido") String apellido,
            @Param("nombres") String nombres,
            @Param("tipoDocumento") TipoDoc tipoDocumento,
            @Param("documentacion") String documentacion);
    
    /**
     * Busca un huésped por su ID.
     * @param id ID del huésped.
     * @return El huésped correspondiente al ID.
     */
    Huesped findById(long id);

    /**
     * Busca un huésped por su CUIT.
     * @param cuit CUIT del huésped.
     * @return Optional con el huésped si existe.
     */
    Optional<Huesped> findByCuit(String cuit);

    

}
