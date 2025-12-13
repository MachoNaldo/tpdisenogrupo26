package grupo26diseno.tpdisenogrupo26.service.handler;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.repository.ReservaRepository;

/*
 * Handler que procesa las reservas de la habitación
 */
@Component
public class ReservaHandler extends EstadoHabitacionHandler {
    
    @Autowired
    private ReservaRepository reservaRepository;
    
    @Override
    protected void procesarEstados(Long numeroHabitacion, LocalDate desde, 
                                  LocalDate hasta, Map<String, String> mapaEstados) {
        
        List<Reserva> listaReservas = reservaRepository
            .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
                numeroHabitacion, hasta, desde);
        
        if (listaReservas != null && !listaReservas.isEmpty()) {
            for (Reserva reserva : listaReservas) {
                llenarMapa(mapaEstados, 
                          reserva.getFechaInicio(), 
                          reserva.getFechaFinal(), 
                          TipoEstadoHabitacion.RESERVADO);
            }
        }
    }
}