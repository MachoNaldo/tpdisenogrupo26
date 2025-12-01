package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.repository.PeriodoRepository;
import jakarta.transaction.Transactional;


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
    public List<PeriodoEstado> obtenerPeriodosEstadoEnRango(Long numeroHabitacion, LocalDate fechaFin,
            LocalDate fechaInicio) {
        return periodoRepository.findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                numeroHabitacion,
                fechaFin,
                fechaInicio);
    }

    @Override
    public boolean existePeriodoEstadoEnRango(Long numeroHabitacion, LocalDate fechaFin, LocalDate fechaInicio) {
        return periodoRepository.existsByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                numeroHabitacion,
                fechaFin,
                fechaInicio); // Si ya existe un periodo en ese rango, quiere decir que ya hay una reserva
                              // o estado que impide la reserva nueva
    }

    @Override
    public void validarDisponibilidadIgnorandoReservas(Long numeroHabitacion, LocalDate fechaInicio,
            LocalDate fechaFin) throws DisponibilidadException {
        List<PeriodoEstado> periodos = obtenerPeriodosEstadoEnRango(numeroHabitacion, fechaFin, fechaInicio);
        for (PeriodoEstado periodo : periodos) {
            if (periodo.getTipoEstado() == TipoEstadoHabitacion.FUERA_SERVICIO && 
                    periodo.getTipoEstado() == TipoEstadoHabitacion.OCUPADO) {
                throw new DisponibilidadException(
                        "La habitación " + numeroHabitacion +
                                " no está disponible para las fechas seleccionadas");
            }
        }
    }

    @Override
    @Transactional
    public void crearPeriodoEstadoOcupado(Habitacion habitacion, LocalDate fInicio, LocalDate fFin) {
        // Buscamos todos los periodos que esten solapados con esta ocupacion  que forzara fuera las reservas
        List<PeriodoEstado> solapados = periodoRepository
                .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                        habitacion.getNumero(), fInicio, fFin);

        // Eliminamos todos estos periodos solapados ya que no existen porque la habitacion pasa a estar ocupada
        if (!solapados.isEmpty()) {
            periodoRepository.deleteAll(solapados);
        }
        //Guardamos el nuevo periodo de estado ocupado
        PeriodoEstado periodoEstado = new PeriodoEstado();
        periodoEstado.setHabitacion(habitacion);
        periodoEstado.setFechaInicio(fInicio);
        periodoEstado.setFechaFin(fFin);
        periodoEstado.setTipoEstado(grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion.OCUPADO);
        periodoRepository.save(periodoEstado);
    }

}
