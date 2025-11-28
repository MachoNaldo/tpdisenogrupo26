package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import grupo26diseno.tpdisenogrupo26.dtos.DisponibilidadDTO;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;

public interface HabitacionService {

    List<DisponibilidadDTO> obtenerDisponibilidad(LocalDate desde, LocalDate hasta);

    void reservarHabitacion(Long numeroHabitacion, LocalDate desde, LocalDate hasta);


    //NO TOCAR
    Map<LocalDate, TipoEstadoHabitacion> obtenerEstadosHabitacionEnPeriodo(
        Long numeroHabitacion,
        LocalDate fechaInicio,
        LocalDate fechaFin
    );
}
