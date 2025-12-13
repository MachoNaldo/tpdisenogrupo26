package grupo26diseno.tpdisenogrupo26.service.handler;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import grupo26diseno.tpdisenogrupo26.model.Estadia;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.repository.EstadiaRepository;

/*
 * Handler que procesa las estadías (ocupaciones) de la habitación
 */
@Component
public class EstadiaHandler extends EstadoHabitacionHandler {
    
    @Autowired
    private EstadiaRepository estadiaRepository;
    
    @Override
    protected void procesarEstados(Long numeroHabitacion, LocalDate desde, 
                                  LocalDate hasta, Map<String, String> mapaEstados) {
        
        List<Estadia> listaEstadias = estadiaRepository
            .findByHabitacionNumeroAndFechaCheckInLessThanEqualAndFechaCheckOutGreaterThanEqual(
                numeroHabitacion, hasta, desde);
        
        if (listaEstadias != null && !listaEstadias.isEmpty()) {
            for (Estadia estadia : listaEstadias) {
                llenarMapa(mapaEstados, 
                          estadia.getFechaCheckIn(), 
                          estadia.getFechaCheckOut(), 
                          TipoEstadoHabitacion.OCUPADO);
            }
        }
    }
}