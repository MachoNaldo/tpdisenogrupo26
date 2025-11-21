package grupo26diseno.tpdisenogrupo26.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;

import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.repository.PeriodoRepository;

@Service
public class HabitacionServiceImpl implements HabitacionService {

    @Autowired
    private PeriodoRepository periodoRepository;

    @Override
    public Map<LocalDate, grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion> obtenerEstadosHabitacionEnPeriodo(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) {
        List<PeriodoEstado> periodos = periodoRepository
                .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                        numeroHabitacion,
                        fechaFin,
                        fechaInicio
                );
        Map<LocalDate, TipoEstadoHabitacion> estadosPorDia = new HashMap<>();
        LocalDate fecha = fechaInicio;
        while (!fecha.isAfter(fechaFin)) {
            estadosPorDia.put(fecha, TipoEstadoHabitacion.LIBRE);
            fecha = fecha.plusDays(1);
        }
        for (PeriodoEstado periodo : periodos) {
            LocalDate inicioReal = periodo.getFechaInicio().isBefore(fechaInicio)
                    ? fechaInicio : periodo.getFechaInicio(); //Verifica que no empiece antes del periodo consultado puede haber arrancado antes
            LocalDate finReal = periodo.getFechaFin().isAfter(fechaFin)
                    ? fechaFin : periodo.getFechaFin();  //Verifica que no termine despues del periodo consultado ya que el periodo puede seguir

            LocalDate f = inicioReal;
            while (!f.isAfter(finReal)) {
                estadosPorDia.put(f, periodo.getTipoEstado()); // Sobreescribe el estado del dia con el del periodo en el ciclo de dias del periodo que corresponden a la consulta
                f = f.plusDays(1);
            }
        }

        return estadosPorDia;
    }
}
