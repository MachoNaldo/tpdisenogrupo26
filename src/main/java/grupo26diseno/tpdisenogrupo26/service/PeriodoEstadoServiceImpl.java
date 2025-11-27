package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;
import grupo26diseno.tpdisenogrupo26.repository.PeriodoRepository;

@Service
public class PeriodoEstadoServiceImpl implements PeriodoEstadoService {

    @Autowired
    private PeriodoRepository periodoRepository;

    @Override
    public void crearPeriodoEstadoReservado(Habitacion habitacion, LocalDate fechaInicio, LocalDate fechaFin) {
        PeriodoEstado periodoEstado = new PeriodoEstado();
        periodoEstado.setHabitacion(habitacion);
        periodoEstado.setFechaInicio(fechaInicio);
        periodoEstado.setFechaFin(fechaFin);
        periodoEstado.setTipoEstado(grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion.RESERVADO);
        periodoRepository.save(periodoEstado);
        
    }

    @Override
    public List<PeriodoEstado> obtenerPeriodosEstadoEnRango(Long numeroHabitacion, LocalDate fechaFin, LocalDate fechaInicio) {
        return periodoRepository.findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                numeroHabitacion,
                fechaFin,
                fechaInicio
        );
    }

    @Override
    public boolean existePeriodoEstadoEnRango(Long numeroHabitacion, LocalDate fechaFin, LocalDate fechaInicio) {
        return periodoRepository.existsByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                numeroHabitacion,
                fechaFin,
                fechaInicio
        );
    }

}
