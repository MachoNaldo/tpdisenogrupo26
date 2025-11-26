package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;

import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;


public interface HabitacionService{
    Map<LocalDate, TipoEstadoHabitacion> obtenerEstadosHabitacionEnPeriodo(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin);
    void validarDisponibilidad(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) throws DisponibilidadException;
    Habitacion buscarPorNumero(Long numeroHabitacion);
}