package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import DTOs.ReservaDTO;
import DTOs.EstadiaDTO;
import DTOs.HuespedDTO;
import DTOs.EstadiaDTO.HabitacionOcupadaDTO;
import DTOs.ReservaDTO.HabitacionReservaDTO;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.model.Estadia;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.repository.HabitacionRepository;
import grupo26diseno.tpdisenogrupo26.repository.ReservaRepository;
import grupo26diseno.tpdisenogrupo26.repository.EstadiaRepository;

@Service
public class HabitacionServiceImpl implements HabitacionService {

    @Autowired
    private PeriodoEstadoService periodoEstadoService;
    @Autowired
    private HuespedService huespedService;
    @Autowired
    private HabitacionRepository habitacionRepository;
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private EstadiaRepository estadiaRepository;


    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");


    @Override
    @Transactional(readOnly = true)
    public Map<LocalDate, grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion> obtenerEstadosHabitacionEnPeriodo(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) {
        List<PeriodoEstado> periodos = periodoEstadoService.obtenerPeriodosEstadoEnRango(numeroHabitacion, fechaFin, fechaInicio);
        Map<LocalDate, TipoEstadoHabitacion> estadosPorDia = new TreeMap<>();
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
    @Override
    public void validarDisponibilidad(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) throws DisponibilidadException {
        boolean existePeriodo = periodoEstadoService.existePeriodoEstadoEnRango(numeroHabitacion, fechaFin, fechaInicio);
        if (existePeriodo) {
            throw new DisponibilidadException(
                    "La habitación " + numeroHabitacion +
                    " no está disponible para las fechas seleccionadas");
        }
    }
    @Override
    public void validarDisponibilidadOcupar(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) throws DisponibilidadException {
        boolean existePeriodo = periodoEstadoService.existePeriodoEstadoEnRangoParaOcupar(numeroHabitacion, fechaFin, fechaInicio);
        if (existePeriodo) {
            throw new DisponibilidadException(
                    "La habitación " + numeroHabitacion +
                    " no puede ser ocupada en las fechas seleccionadas");
        }
    }

    @Override
    @Transactional
    public void agregarReserva(ReservaDTO reservaDTO) throws DisponibilidadException {
        
        for (HabitacionReservaDTO habReserva : reservaDTO.getReservas()) {
            
            // Parsear fechas
            LocalDate fechaInicio = LocalDate.parse(habReserva.getFechaInicio(), FORMATTER);
            LocalDate fechaFin = LocalDate.parse(habReserva.getFechaFin(), FORMATTER);

            // Buscar la habitación en la BD
            Habitacion habitacion = this.buscarPorNumero(Long.valueOf( habReserva.getNumeroHabitacion()));
            // Validar disponibilidad
            this.validarDisponibilidad(habitacion.getNumero(), fechaInicio, fechaFin);

            // Crear la reserva
            Reserva reserva = new Reserva();
            reserva.setApellidoReservador(reservaDTO.getCliente().getApellido());
            reserva.setNombreReservador(reservaDTO.getCliente().getNombre());
            reserva.setTelefonoReservador(reservaDTO.getCliente().getTelefono());
            reserva.setHabitacion(habitacion);
            reserva.setFechaInicio(fechaInicio); 
            reserva.setFechaFinal(fechaFin);  
            //Crear el periodo de estado reservado asociado a la reserva
            periodoEstadoService.crearPeriodoEstadoReservado(habitacion, fechaInicio, fechaFin);

            reservaRepository.save(reserva);
        }
    }

    @Override
    @Transactional
    public void agregarEstadia(EstadiaDTO estadiaDTO) throws DisponibilidadException {
        for (HabitacionOcupadaDTO habOcupa : estadiaDTO.getHabitaciones()) {
            
            // Parsear fechas
            LocalDate fechaInicio = LocalDate.parse(habOcupa.getFechaInicio(), FORMATTER);
            LocalDate fechaFin = LocalDate.parse(habOcupa.getFechaFin(), FORMATTER);

            // Buscar la habitación en la BD
            Habitacion habitacion = this.buscarPorNumero(habOcupa.getNumeroHabitacion());
            // Validar disponibilidad
            this.validarDisponibilidadOcupar(habitacion.getNumero(), fechaInicio, fechaFin);
            
            //Crear la estadía
            Estadia estadia = new Estadia();

            estadia.setHabitacion(habitacion);
            estadia.setFechaCheckIn(fechaInicio);
            estadia.setFechaCheckOut(fechaFin);
            
            //Agregar ocupante principal
            Huesped huespedPrincipal = huespedService.buscarHuespedPorId(habOcupa.getOcupante().getId())
                .orElseThrow(() -> new RuntimeException(
                    "Huésped no encontrado: " + habOcupa.getOcupante().getId()
                ));
            estadia.setHuespedPrincipal(huespedPrincipal);

            //Agregar acompañantes
            for (HuespedDTO acompanante : habOcupa.getAcompanantes()) {
                Huesped huespedAcomp = huespedService.buscarHuespedPorId(acompanante.getId())
                    .orElseThrow(() -> new RuntimeException(
                        "Huésped no encontrado: " + acompanante.getId()
                    ));
                estadia.getAcompanantes().add(huespedAcomp);
            }

            periodoEstadoService.crearPeriodoEstadoOcupado(habitacion, fechaInicio, fechaFin);

            estadiaRepository.save(estadia);
        }
    }


    @Override
    public Habitacion buscarPorNumero(Long numeroHabitacion) {
        return habitacionRepository.findByNumero(numeroHabitacion)
            .orElseThrow(() -> new RuntimeException(
                "Habitación no encontrada: " + numeroHabitacion
            ));
    }
}
