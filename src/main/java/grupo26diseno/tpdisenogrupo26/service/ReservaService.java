package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;

public interface ReservaService {
    List<ReservaDTO> obtenerReservasPorHabitacionYFecha(long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin);
}
