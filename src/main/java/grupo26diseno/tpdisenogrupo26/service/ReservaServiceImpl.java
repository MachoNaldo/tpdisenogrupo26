package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO.HabitacionReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.repository.HabitacionRepository;
import grupo26diseno.tpdisenogrupo26.repository.PeriodoRepository;
import grupo26diseno.tpdisenogrupo26.repository.ReservaRepository;

@Service
public class ReservaServiceImpl implements ReservaService {

    private static final DateTimeFormatter FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private HabitacionRepository habitacionRepository;

    @Autowired
    private PeriodoRepository periodoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private HabitacionService habitacionService;

    @Override
    public List<ReservaDTO> obtenerReservasPorHabitacionYFecha(long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) {
        List<Reserva> reservas = reservaRepository
                .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
                        numeroHabitacion, fechaFin, fechaInicio);

         List<ReservaDTO> reservasSolapadas = reservas.stream().map(reserva -> {
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
        return reservasSolapadas;
    }

    @Override // Revisar creo que no se usa
    @Transactional
    public void crearReserva(ReservaDTO dto) throws DisponibilidadException {

        for (HabitacionReservaDTO habReserva : dto.getReservas()) {

            Long numeroHab = habReserva.getNumeroHabitacion().longValue();
            LocalDate fInicio = LocalDate.parse(habReserva.getFechaInicio(), FORMAT);
            LocalDate fFin = LocalDate.parse(habReserva.getFechaFin(), FORMAT);

            // 1️⃣ Validar disponibilidad REAL
            Map<LocalDate, TipoEstadoHabitacion> estados =
                habitacionService.obtenerEstadosHabitacionEnPeriodo(
                    numeroHab, fInicio, fFin
                );

            for (TipoEstadoHabitacion est : estados.values()) {
                if (est != TipoEstadoHabitacion.LIBRE) {
                    throw new DisponibilidadException(
                        "La habitación " + numeroHab +
                        " no está disponible entre " + fInicio + " y " + fFin
                    );
                }
            }

            // 2️⃣ Obtener habitación real desde la BD
            Habitacion habitacion = habitacionRepository
                .findById(numeroHab)
                .orElseThrow(() ->
                    new RuntimeException("La habitación " + numeroHab + " no existe")
                );

            // 3️⃣ Crear y guardar la reserva principal
            Reserva reserva = new Reserva();
            reserva.setFechaInicio(fInicio);
            reserva.setFechaFinal(fFin);
            reserva.setNombreReservador(dto.getCliente().getNombre());
            reserva.setApellidoReservador(dto.getCliente().getApellido());
            reserva.setTelefonoReservador(dto.getCliente().getTelefono());
            reserva.setHabitacion(habitacion);

            reservaRepository.save(reserva);

            // 4️⃣ Traer los periodos existentes en esas fechas
            List<PeriodoEstado> periodos = periodoRepository
                .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                    numeroHab,
                    fFin,
                    fInicio
                );

            if (periodos.isEmpty()) {
                throw new RuntimeException(
                    "No existen periodos para marcar como reservados. Revisa el DataInitializer."
                );
            }

            // 5️⃣ Marcarlos como RESERVADO
            for (PeriodoEstado p : periodos) {
                p.setTipoEstado(TipoEstadoHabitacion.RESERVADO);
            }

            // 6️⃣ Guardar actualizaciones
            periodoRepository.saveAll(periodos);
        }
    }
}
