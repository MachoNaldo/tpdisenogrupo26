package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.Map;

import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;


public interface HabitacionService{
    Map<LocalDate, TipoEstadoHabitacion> obtenerEstadosHabitacionEnPeriodo(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin);
}