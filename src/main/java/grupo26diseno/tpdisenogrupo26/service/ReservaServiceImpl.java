package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.repository.ReservaRepository;
import grupo26diseno.tpdisenogrupo26.mapper.ReservaMapper;

@Service
public class ReservaServiceImpl implements ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ReservaMapper reservaMapper;

    @Override
    public List<ReservaDTO> obtenerReservasPorHabitacionYFecha(long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) {
        List<Reserva> reservas = reservaRepository
                .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
                        numeroHabitacion, fechaFin, fechaInicio);

         List<ReservaDTO> reservasSolapadas = reservas.stream().map(reserva -> {
            ReservaDTO dto = new ReservaDTO();
          //  System.out.println(">>> RESERVA ENCONTRADA: " + reserva.getApellidoReservador(  ));
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
           // System.out.println(">>> DTO RESERVA CREADA: " + dto.getCliente());
            return dto;
        }).toList();
        return reservasSolapadas;
    }

    @Override
    public List<ReservaDTO> buscarReservaPorCriterios(String apellido, String nombres) {
            List<ReservaDTO> listaReservaDTOs = reservaRepository.buscarPorCriterios(apellido, nombres).stream()
            .map(reserva -> reservaMapper.crearDTO(reserva)).toList();
            return listaReservaDTOs;
    }

}
