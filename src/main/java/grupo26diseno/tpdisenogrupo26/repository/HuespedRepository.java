package grupo26diseno.tpdisenogrupo26.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;

@Repository
public interface HuespedRepository  extends JpaRepository<Huesped, Long> {
    Huesped findByTipoDocumentoAndDocumentacion(TipoDoc tipoDocumento, String documentacion);
}
