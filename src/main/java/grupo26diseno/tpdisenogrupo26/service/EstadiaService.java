package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;

import grupo26diseno.tpdisenogrupo26.dtos.EstadiaFacturaDTO;

public interface EstadiaService {
    public EstadiaFacturaDTO obtenerEstadiaParaFacturar(Long nroHabitacion, LocalDate fechaSalida);
}
