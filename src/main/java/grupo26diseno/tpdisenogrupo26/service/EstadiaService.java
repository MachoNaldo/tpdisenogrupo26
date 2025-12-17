package grupo26diseno.tpdisenogrupo26.service;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

import grupo26diseno.tpdisenogrupo26.dtos.EstadiaFacturaDTO;


public interface EstadiaService {
    /**
     * Obtiene la estadía correspondiente a una habitación y fecha de salida
     * para su facturación.
     * @param nroHabitacion Número de la habitación.
     * @param fechaSalida Fecha de salida de la estadía.
     * @return DTO con los datos necesarios para facturar la estadía.
     */
    public EstadiaFacturaDTO obtenerEstadiaParaFacturar(Long nroHabitacion, LocalDate fechaSalida);
}