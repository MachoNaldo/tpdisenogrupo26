package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.mapper.ReservaMapper;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
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



  
    @Override
    @Transactional
    public void cancelarReserva(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

         
        reservaRepository.delete(reserva);
    }
}
