package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.Map;

import DTOs.EstadiaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;


public interface HabitacionService{
    Map<LocalDate, TipoEstadoHabitacion> obtenerEstadosHabitacionEnPeriodo(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin);
    void validarDisponibilidad(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) throws DisponibilidadException;
    Habitacion buscarPorNumero(Long numeroHabitacion);
     public void ocuparHabitacion(EstadiaDTO estadiaDTO) throws DisponibilidadException;
}
