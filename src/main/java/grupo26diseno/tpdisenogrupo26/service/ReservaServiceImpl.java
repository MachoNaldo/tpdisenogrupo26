package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.mapper.ReservaMapper;
import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.repository.PeriodoRepository;
import grupo26diseno.tpdisenogrupo26.repository.ReservaRepository;

@Service
public class ReservaServiceImpl implements ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private PeriodoRepository periodoRepository;

    @Autowired
    private ReservaMapper reservaMapper;

    @Override
    public List<ReservaDTO> obtenerReservasPorHabitacionYFecha(long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) {
        List<Reserva> reservas = reservaRepository
                .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
                        numeroHabitacion, fechaFin, fechaInicio);

        return reservas.stream().map(reserva -> {
            ReservaDTO dto = new ReservaDTO();
            dto.setCliente(new ReservaDTO.ClienteDTO(
                    reserva.getNombreReservador(),
                    reserva.getApellidoReservador(),
                    reserva.getTelefonoReservador()
            ));
            ReservaDTO.HabitacionReservaDTO habReserva = new ReservaDTO.HabitacionReservaDTO();
            habReserva.setNumeroHabitacion(reserva.getHabitacion().getNumero());
            habReserva.setFechaInicio(reserva.getFechaInicio().toString());
            habReserva.setFechaFin(reserva.getFechaFinal().toString());
            dto.getReservas().add(habReserva);
            return dto;
        }).toList();
    }

    @Override
    public List<ReservaDTO> buscarReservaPorCriterios(String apellido, String nombres) {
        return reservaRepository.buscarPorCriterios(apellido, nombres).stream()
                .map(reserva -> reservaMapper.crearDTO(reserva))
                .toList();
    }



    //Cancelar RESERVA
    @Override
    @Transactional
    public void cancelarReserva(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        Long numeroHabitacion = reserva.getHabitacion().getNumero();
        LocalDate inicio = reserva.getFechaInicio();
        LocalDate fin = reserva.getFechaFinal();

        // Buscamos los periodos que se superponen con el rango de la reserva
        List<PeriodoEstado> periodos = periodoRepository
                .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                        numeroHabitacion,
                        fin,
                        inicio
                );

        // Eliminamos el periodo reservado que coincide con la reserva
        PeriodoEstado aEliminar = periodos.stream()
                .filter(p -> p.getTipoEstado() == TipoEstadoHabitacion.RESERVADO)
                .filter(p -> p.getFechaInicio().equals(inicio) && p.getFechaFin().equals(fin))
                .findFirst()
                .orElse(null);

        // Esto es por si no hay un resultado exacto, igual elimina el primero

        if (aEliminar == null) {
            aEliminar = periodos.stream()
                    .filter(p -> p.getTipoEstado() == TipoEstadoHabitacion.RESERVADO)
                    .findFirst()
                    .orElse(null);
        }

        if (aEliminar != null) {
            periodoRepository.delete(aEliminar);
        }

         // Elimina la reserva
        reservaRepository.delete(reserva);
    }
}
