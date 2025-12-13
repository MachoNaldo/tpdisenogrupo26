package grupo26diseno.tpdisenogrupo26.service.handler;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;
import grupo26diseno.tpdisenogrupo26.repository.PeriodoRepository;

/*
 * Handler que procesa los períodos de estado de la habitación
 * (mantenimiento, limpieza, etc.)
 */
@Component
public class PeriodoEstadoHandler extends EstadoHabitacionHandler {
    
    @Autowired
    private PeriodoRepository periodoRepository;
    
    @Override
    protected void procesarEstados(Long numeroHabitacion, LocalDate desde, 
                                  LocalDate hasta, Map<String, String> mapaEstados) {
        
        List<PeriodoEstado> listaPeriodos = periodoRepository
            .findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
                numeroHabitacion, hasta, desde);
        
        if (listaPeriodos != null && !listaPeriodos.isEmpty()) {
            for (PeriodoEstado periodo : listaPeriodos) {
                llenarMapa(mapaEstados, 
                          periodo.getFechaInicio(), 
                          periodo.getFechaFin(), 
                          periodo.getTipoEstado());
            }
        }
    }
}