package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import grupo26diseno.tpdisenogrupo26.dtos.*;
import grupo26diseno.tpdisenogrupo26.dtos.EstadiaDTO.HabitacionOcuparDTO;
import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO.HabitacionReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Estadia;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.repository.EstadiaRepository;
import grupo26diseno.tpdisenogrupo26.repository.HabitacionRepository;
import grupo26diseno.tpdisenogrupo26.repository.PeriodoRepository;
import grupo26diseno.tpdisenogrupo26.repository.ReservaRepository;

@Service
public class HabitacionServiceImpl implements HabitacionService {

    @Autowired
    private HabitacionRepository habitacionRepository;
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private PeriodoEstadoService periodoEstadoService;
    @Autowired
    private PeriodoRepository periodoRepository;
    @Autowired
    private HuespedService huespedService;
    @Autowired
    private EstadiaRepository estadiaRepository;

    private static final DateTimeFormatter FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public List<DisponibilidadDTO> obtenerDisponibilidad(LocalDate desde, LocalDate hasta) {

        List<Habitacion> habitaciones = habitacionRepository.findAll();

        List<DisponibilidadDTO> resultado = new ArrayList<>();

        for (Habitacion h : habitaciones) {

            Map<String, String> mapa = new LinkedHashMap<>();
            Long numhab = h.getNumero();
            List<PeriodoEstado> listaPeriodo = periodoRepository
                    .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(numhab, hasta,
                            desde);
            if (listaPeriodo != null) {
                for (PeriodoEstado p : listaPeriodo) {

                    LocalDate fechaInicio = p.getFechaInicio();
                    LocalDate fechaFinal = p.getFechaFin();
                    TipoEstadoHabitacion estadoFinal = p.getTipoEstado();

                    // Iteramos todas las fechas entre inicio y fin
                    LocalDate fecha = fechaInicio;
                    while (!fecha.isAfter(fechaFinal)) {
                        mapa.put(fecha.toString(), estadoFinal.name());
                        fecha = fecha.plusDays(1);
                    }
                }
            }
            // Ahora revisamos todas las reservas
            List<Reserva> listaReservas = reservaRepository
                    .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(numhab,
                            hasta, desde);
            if (listaReservas != null) {
                for (Reserva r : listaReservas) {

                    LocalDate fechaInicio = r.getFechaInicio();
                    LocalDate fechaFinal = r.getFechaFinal();
                    TipoEstadoHabitacion estadoFinal = TipoEstadoHabitacion.RESERVADO;

                    // Iteramos todas las fechas entre inicio y fin
                    LocalDate fecha = fechaInicio;
                    while (!fecha.isAfter(fechaFinal)) {
                        mapa.put(fecha.toString(), estadoFinal.name());
                        fecha = fecha.plusDays(1);
                    }
                }
            }
            // Ahora todas las ocupaciones
            List<Estadia> listaEstadias = estadiaRepository
                    .findByHabitacionNumeroAndFechaCheckInLessThanEqualAndFechaCheckOutGreaterThanEqual(numhab, hasta,
                            desde);
            if (listaEstadias != null) {
                for (Estadia e : listaEstadias) {

                    LocalDate fechaInicio = e.getFechaCheckIn();
                    LocalDate fechaFinal = e.getFechaCheckOut();
                    TipoEstadoHabitacion estadoFinal = TipoEstadoHabitacion.OCUPADO;

                    // Iteramos todas las fechas entre inicio y fin
                    LocalDate fecha = fechaInicio;
                    while (!fecha.isAfter(fechaFinal)) {
                        mapa.put(fecha.toString(), estadoFinal.name());
                        fecha = fecha.plusDays(1);
                    }
                }
            }
            resultado.add(
                    new DisponibilidadDTO(
                            numhab,
                            (h.getTipo() == null ? "SIN_TIPO" : h.getTipo().name()),
                            mapa));

        }
    return resultado;
        /*
         * LocalDate actual = desde;
         * while (!actual.isAfter(hasta)) {
         * 
         * TipoEstadoHabitacion estadoFinal;
         * 
         * List<PeriodoEstado> periodos = periodoRepository.
         * findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
         * h.getTipo, desde, hasta)
         * if (h.getPeriodos() != null) {
         * for (PeriodoEstado p : h.getPeriodos()) {
         * if (!actual.isBefore(p.getFechaInicio()) &&
         * !actual.isAfter(p.getFechaFin())) {
         * estadoFinal = p.getTipoEstado();
         * break;
         * }
         * }
         * }
         * 
         * // Guardamos el estado como STRING
         * mapa.put(actual.toString(), estadoFinal.name());
         * 
         * actual = actual.plusDays(1);
         * }
         * 
         * resultado.add(
         * new DisponibilidadDTO(
         * h.getNumero(),
         * (h.getTipo() == null ? "SIN_TIPO" : h.getTipo().name()),
         * mapa));
         * }
         * 
         * return resultado;
         */
    }

    @Override
    public Map<LocalDate, TipoEstadoHabitacion> obtenerEstadosHabitacionEnPeriodo(
            Long numeroHabitacion, LocalDate inicio, LocalDate fin) {

        Map<LocalDate, TipoEstadoHabitacion> mapa = new LinkedHashMap<>();

        Habitacion h = habitacionRepository.findByNumeroConPeriodos(numeroHabitacion)
                .orElseThrow(() -> new RuntimeException("Habitación no existe"));

        LocalDate actual = inicio;

        while (!actual.isAfter(fin)) {
            TipoEstadoHabitacion estado = TipoEstadoHabitacion.LIBRE;

            if (h.getPeriodos() != null) {
                for (PeriodoEstado p : h.getPeriodos()) {
                    if (!actual.isBefore(p.getFechaInicio()) &&
                            !actual.isAfter(p.getFechaFin())) {

                        estado = p.getTipoEstado();
                        break;
                    }
                }
            }

            mapa.put(actual, estado);
            actual = actual.plusDays(1);
        }

        return mapa;
    }

    @Override
    @Transactional
    public void crearReserva(ReservaDTO dto) throws DisponibilidadException {

        for (HabitacionReservaDTO habReserva : dto.getReservas()) {

            Long numeroHab = habReserva.getNumeroHabitacion();
            LocalDate fInicio = LocalDate.parse(habReserva.getFechaInicio(), FORMAT);
            LocalDate fFin = LocalDate.parse(habReserva.getFechaFin(), FORMAT);

            // Valida la disponibilidad para evitar problemas de concurrencia

            this.validarDisponibilidad(numeroHab, fInicio, fFin);

            // Buscamos la entidad habitacion real desde la BD
            Habitacion habitacion = habitacionRepository
                    .findById(numeroHab)
                    .orElseThrow(() -> new RuntimeException("La habitación " + numeroHab + " no existe"));

            // Creamos y guardamos la reserva principal
            Reserva reserva = new Reserva();
            reserva.setFechaInicio(fInicio);
            reserva.setFechaFinal(fFin);
            reserva.setNombreReservador(dto.getCliente().getNombre());
            reserva.setApellidoReservador(dto.getCliente().getApellido());
            reserva.setTelefonoReservador(dto.getCliente().getTelefono());
            reserva.setHabitacion(habitacion);
            // Guardamos la reserva en su entidad correspondiente en la BD
            reservaRepository.save(reserva);
            // Creamos un periodo reservado asociado correspondiente a la reserva
            periodoEstadoService.crearPeriodoEstadoReservado(habitacion, fInicio, fFin);
        }
    }

    @Override
    @Transactional
    public void ocuparHabitacion(EstadiaDTO dto, boolean forzar) throws DisponibilidadException {
        for (HabitacionOcuparDTO habOcupar : dto.getEstadias()) {
            Long numeroHab = habOcupar.getNumeroHabitacion().longValue();
            LocalDate fInicio = LocalDate.parse(habOcupar.getFechaInicio(), FORMAT);
            LocalDate fFin = LocalDate.parse(habOcupar.getFechaFin(), FORMAT);

            // Valida la disponibilidad para evitar problemas de concurrencia, si el usuario
            // pidió forzar, es decir eliminar reservas solapadas
            // Entonces se valida ignorando las reservas
            if (!forzar) {
                this.validarDisponibilidad(numeroHab, fInicio, fFin);
            } else {
                periodoEstadoService.validarDisponibilidadIgnorandoReservas(numeroHab, fInicio, fFin);
            }
            // Buscamos la entidad habitacion real desde la BD
            Habitacion habitacion = habitacionRepository
                    .findById(numeroHab)
                    .orElseThrow(() -> new RuntimeException("La habitación " + numeroHab + " no existe"));

            // Creamos y guardamos la estadía principal
            Estadia estadia = new Estadia();
            estadia.setFechaCheckIn(fInicio);
            estadia.setFechaCheckOut(fFin);
            estadia.setHabitacion(habitacion);

            // Buscamos el huesped y lo asignamos como el huésped principal
            Huesped huespedPrincipal = huespedService.buscarHuespedPorId(habOcupar.getHuespedPrincipal().getId())
                    .orElseThrow(() -> new RuntimeException("El huésped principal con ID "
                            + habOcupar.getHuespedPrincipal().getId() + " no existe"));

            estadia.setHuespedPrincipal(huespedPrincipal);

            // Asignamos los acompañantes si los hay
            if (habOcupar.getAcompanantes() != null && !habOcupar.getAcompanantes().isEmpty()) {
                List<Huesped> acompanantes = habOcupar.getAcompanantes().stream()
                        .map(a -> huespedService.buscarHuespedPorId(a.getId())
                                .orElseThrow(() -> new RuntimeException("Huésped no encontrado: " + a.getId())))
                        .collect(Collectors.toList());
                estadia.setAcompanantes(acompanantes);
            }

            // Guardamos la estadía
            estadiaRepository.save(estadia);

            // Creamos periodo estado ocupado asociado
            periodoEstadoService.crearPeriodoEstadoOcupado(habitacion, fInicio, fFin);

            // Eliminamos las reservas si esta ocupacion las solapa (forzar=true)
            if (forzar) {
                List<Reserva> reservasSolapadas = reservaRepository
                        .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
                                numeroHab, fFin, fInicio);
                if (!reservasSolapadas.isEmpty()) {
                    reservaRepository.deleteAll(reservasSolapadas);
                }
            }
        }
    }

    @Override
    public void validarDisponibilidad(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin)
            throws DisponibilidadException {
        boolean existePeriodo = periodoEstadoService.existePeriodoEstadoEnRango(numeroHabitacion, fechaFin,
                fechaInicio);
        if (existePeriodo) {
            throw new DisponibilidadException(
                    "La habitación " + numeroHabitacion +
                            " no está disponible para las fechas seleccionadas");
        }
    }

}
