package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import grupo26diseno.tpdisenogrupo26.dtos.DisponibilidadDTO;
import grupo26diseno.tpdisenogrupo26.dtos.EstadiaDTO;
import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;


public interface HabitacionService{
    Map<LocalDate, TipoEstadoHabitacion> obtenerEstadosHabitacionEnPeriodo(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin);
    void validarDisponibilidad(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) throws DisponibilidadException;
   // Habitacion buscarPorNumero(Long numeroHabitacion);
    public void ocuparHabitacion(EstadiaDTO estadiaDTO, boolean forzar) throws DisponibilidadException;
    //public void reservarHabitacion(Long numero, LocalDate desde, LocalDate hasta);
    public void crearReserva(ReservaDTO dto) throws DisponibilidadException;
    List<DisponibilidadDTO> obtenerDisponibilidad(LocalDate desde, LocalDate hasta);
}
