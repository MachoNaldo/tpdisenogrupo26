package grupo26diseno.tpdisenogrupo26.service;

import java.util.Optional;

import grupo26diseno.tpdisenogrupo26.dtos.ResponsablePagoDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;

public interface ResponsablePagoService {

    /**
     * Crea un nuevo responsable de pago en el sistema.
     * @param dto Datos del responsable de pago a crear.
     * @param forzar Si es true, permite registrar aunque el CUIT ya exista.
     * @return El responsable de pago creado.
     * @throws DocumentoUsadoException Si el CUIT ya está asociado a otro responsable de pago y no se forzó la operación.
     */
    ResponsablePago crearResponsablePago(
            ResponsablePagoDTO dto,
            boolean forzar
    ) throws DocumentoUsadoException;

    /**
     * Busca un responsable de pago por su ID.
     * @param id ID del responsable de pago.
     * @return Optional con el responsable si existe.
     */
    Optional<ResponsablePago> buscarResponsablePagoPorId(Long id);

    /**
     * Busca un responsable de pago por su número de CUIT.
     * @param cuit CUIT del responsable de pago.
     * @return Optional con el responsable si existe.
     */
    Optional<ResponsablePago> buscarResponsablePagoPorCuit(String cuit);
}
