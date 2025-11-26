package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;
import java.time.format.DateTimeFormatter;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import DTOs.ReservaDTO;
import DTOs.ReservaDTO.HabitacionReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import jakarta.transaction.Transactional;
@Service
public class ReservaServiceImpl implements ReservaService {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Autowired
    private HabitacionService habitacionService;

    @Override
    @Transactional
    public void crearReserva(ReservaDTO reservaDTO) throws DisponibilidadException {
        
        for (HabitacionReservaDTO habReserva : reservaDTO.getReservas()) {
            
            // Parsear fechas
            LocalDate fechaInicio = LocalDate.parse(habReserva.getFechaInicio(), FORMATTER);
            LocalDate fechaFin = LocalDate.parse(habReserva.getFechaFin(), FORMATTER);

            // Buscar la habitación en la BD
            Habitacion habitacion = habitacionService.buscarPorNumero(Long.valueOf( habReserva.getNumeroHabitacion()));
            // Validar disponibilidad
            if (!habitacionDisponible(habitacion, fechaInicio, fechaFin)) {
                throw new DisponibilidadException(
                        "La habitación " + habitacion.getNumero() + 
                        " no está disponible para las fechas seleccionadas");
            }

            // Crear la reserva
            Reserva reserva = new Reserva();
            reserva.setCliente(cliente);
            reserva.setHabitacion(habitacion);
            reserva.setFechaInicio(fechaInicio);
            reserva.setFechaFin(fechaFin);
            reserva.setEstado("CONFIRMADA");
            reserva.setFechaCreacion(LocalDate.now());

            reservaRepository.save(reserva);
        }
    }

}
