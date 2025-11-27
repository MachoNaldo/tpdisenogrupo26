package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;

import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;

public interface PeriodoEstadoService {

    void crearPeriodoEstadoReservado(Habitacion habitacion, LocalDate fechaInicio, LocalDate fechaFin);
    List<PeriodoEstado> obtenerPeriodosEstadoEnRango(Long numeroHabitacion, LocalDate fechaFin, LocalDate fechaInicio);
    boolean existePeriodoEstadoEnRango(Long numeroHabitacion, LocalDate fechaFin, LocalDate fechaInicio);

}
