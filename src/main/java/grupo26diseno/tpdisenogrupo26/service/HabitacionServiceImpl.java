package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.dtos.DisponibilidadDTO;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.repository.HabitacionRepository;
import grupo26diseno.tpdisenogrupo26.repository.ReservaRepository;
import grupo26diseno.tpdisenogrupo26.repository.EstadiaRepository;

@Service
public class HabitacionServiceImpl implements HabitacionService {

    @Autowired
    private HabitacionRepository habitacionRepository;
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private EstadiaRepository estadiaRepository;


    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");


    @Override
    public List<DisponibilidadDTO> obtenerDisponibilidad(LocalDate desde, LocalDate hasta) {

        // ============================================
        // LOG PARA DETECTAR EL ERROR 500
        // ============================================
        List<Habitacion> habitaciones = habitacionRepository.findAllConPeriodos();


        System.out.println("=== DEBUG DISPONIBILIDAD ===");
        System.out.println("Habitaciones encontradas: " + habitaciones.size());

        for (Habitacion h : habitaciones) {

            System.out.println("---- HABITACION Nº: " + h.getNumero() + " ----");

            // Tipo habitación
            if (h.getTipo() == null) {
                System.out.println("ERROR: El tipo de habitación es NULL");
            } else {
                System.out.println("Tipo: " + h.getTipo().name());
            }

            // Periodos
            if (h.getPeriodos() == null) {
                System.out.println("ERROR: h.getPeriodos() es NULL");
            } else {
                System.out.println("Periodos cargados: " + h.getPeriodos().size());

                for (PeriodoEstado p : h.getPeriodos()) {
                    System.out.println(
                        "   Periodo -> inicio=" + p.getFechaInicio()
                        + " fin=" + p.getFechaFin()
                        + " estado=" + p.getTipoEstado()
                    );
                }
            }
        }

        System.out.println("=== FIN DEBUG ===");

        // ============================================
        // LÓGICA ORIGINAL (sin cambios)
        // ============================================

        List<DisponibilidadDTO> resultado = new ArrayList<>();

        for (Habitacion h : habitaciones) {

            Map<String, String> mapa = new LinkedHashMap<>();

            LocalDate actual = desde;
            while (!actual.isAfter(hasta)) {

                // Estado por defecto
                TipoEstadoHabitacion estadoFinal = TipoEstadoHabitacion.LIBRE;

                if (h.getPeriodos() != null) {
                    for (PeriodoEstado p : h.getPeriodos()) {
                        if (!actual.isBefore(p.getFechaInicio()) &&
                            !actual.isAfter(p.getFechaFin())) {

                            estadoFinal = p.getTipoEstado();
                            break;
                        }
                    }
                }

                // Guardamos el estado como STRING
                mapa.put(actual.toString(), estadoFinal.name());

                actual = actual.plusDays(1);
            }

            resultado.add(
                new DisponibilidadDTO(
                    h.getNumero(),
                    (h.getTipo() == null ? "SIN_TIPO" : h.getTipo().name()),
                    mapa
                )
            );
        }

        return resultado;
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
        public void reservarHabitacion(Long numero, LocalDate desde, LocalDate hasta) {

            Habitacion h = habitacionRepository.findById(numero)
                .orElseThrow(() -> new RuntimeException("Habitación no existe"));

            // Crear periodo reservado
            PeriodoEstado nuevo = new PeriodoEstado();
            nuevo.setHabitacion(h);
            nuevo.setFechaInicio(desde);
            nuevo.setFechaFin(hasta);
            nuevo.setTipoEstado(TipoEstadoHabitacion.RESERVADO);

            // Agregarlo a la habitación
            h.getPeriodos().add(nuevo);

            // Guardar (gracias a la relación bidireccional se guarda PeriodoEstado)
            habitacionRepository.save(h);
        }


}
