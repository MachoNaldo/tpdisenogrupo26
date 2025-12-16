package grupo26diseno.tpdisenogrupo26.service;

import grupo26diseno.tpdisenogrupo26.dtos.CrearFacturaRequest;
import grupo26diseno.tpdisenogrupo26.dtos.FacturaDTO;

public interface FacturaService {
    public FacturaDTO crearFactura(CrearFacturaRequest request);
    public FacturaDTO obtenerFactura(Long id);
}
