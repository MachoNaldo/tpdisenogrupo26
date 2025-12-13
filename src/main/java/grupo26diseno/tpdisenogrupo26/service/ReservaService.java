package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;


import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
//import grupo26diseno.tpdisenogrupo26.model.TipoDoc;

public interface ReservaService {
    List<ReservaDTO> obtenerReservasPorHabitacionYFecha(long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin);

    List<ReservaDTO> buscarReservaPorCriterios(String apellido, String nombres);

}

