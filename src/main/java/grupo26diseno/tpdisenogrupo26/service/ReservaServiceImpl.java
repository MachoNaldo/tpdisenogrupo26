package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import DTOs.ReservaDTO;
import DTOs.ReservaDTO.HabitacionReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.repository.ReservaRepository;
import jakarta.transaction.Transactional;
@Service
public class ReservaServiceImpl implements ReservaService {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Autowired
    private HabitacionService habitacionService;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private PeriodoEstadoService periodoService;

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
            habitacionService.validarDisponibilidad(habitacion.getNumero(), fechaInicio, fechaFin);

            // Crear la reserva
            Reserva reserva = new Reserva();
            reserva.setApellidoReservador(reservaDTO.getCliente().getApellido());
            reserva.setNombreReservador(reservaDTO.getCliente().getNombre());
            reserva.setTelefonoReservador(reservaDTO.getCliente().getTelefono());
            reserva.setHabitacion(habitacion);
            reserva.setFechaInicio(fechaInicio);
            reserva.setFechaFinal(fechaFin);  
            //Crear el periodo de estado reservado asociado a la reserva
            periodoService.crearPeriodoEstadoReservado(habitacion, fechaInicio, fechaFin);

            reservaRepository.save(reserva);
        }
    }

}
