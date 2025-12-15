package grupo26diseno.tpdisenogrupo26.service;

import java.util.Optional;

import grupo26diseno.tpdisenogrupo26.dtos.ResponsablePagoDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;

public interface ResponsablePagoService {

    ResponsablePago crearResponsablePago(
            ResponsablePagoDTO dto,
            boolean forzar
    ) throws DocumentoUsadoException;

    Optional<ResponsablePago> buscarResponsablePagoPorId(Long id);

    Optional<ResponsablePago> buscarResponsablePagoPorCuit(String cuit);
}
