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
    List<Huesped> findByTipoDocumentoAndDocumentacion(TipoDoc tipoDocumento, String documentacion);
    
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
    Huesped findById(long id);

    Optional<Huesped> findByCuit(String cuit);

}
