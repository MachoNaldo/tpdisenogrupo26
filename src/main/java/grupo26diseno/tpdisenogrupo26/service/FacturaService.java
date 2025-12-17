package grupo26diseno.tpdisenogrupo26.service;

import grupo26diseno.tpdisenogrupo26.dtos.CrearFacturaRequest;
import grupo26diseno.tpdisenogrupo26.dtos.FacturaDTO;

public interface FacturaService {
    /**
     * Genera una nueva factura basada en una estadía y un responsable de pago.
     * Calcula automáticamente los montos, aplica impuestos según la condición fiscal
     * y genera el número de comprobante.
     * @param request Datos necesarios para crear la factura.
     * @return DTO de la factura generada con sus detalles.
     */
    public FacturaDTO crearFactura(CrearFacturaRequest request);

    /**
     * Busca una factura existente por su identificador.
     * @param id ID único de la factura.
     * @return DTO de la factura encontrada.
     */
    public FacturaDTO obtenerFactura(Long id);
}
