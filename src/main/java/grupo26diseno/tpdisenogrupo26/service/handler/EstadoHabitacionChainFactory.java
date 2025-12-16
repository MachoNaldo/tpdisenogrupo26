package grupo26diseno.tpdisenogrupo26.service.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Factory que construye la cadena de handlers para procesar
 * el estado de disponibilidad de habitaciones
 */
@Component
public class EstadoHabitacionChainFactory {
    
    @Autowired
    private PeriodoEstadoHandler periodoEstadoHandler;
    
    @Autowired
    private ReservaHandler reservaHandler;
    
    @Autowired
    private EstadiaHandler estadiaHandler;

    /**
     * Crea y configura la cadena de responsabilidad
     * @return El primer handler de la cadena listo para procesar.
     */
    public EstadoHabitacionHandler crearCadena() {
        // Configuramos la cadena
        periodoEstadoHandler
            .setSiguiente(reservaHandler)
            .setSiguiente(estadiaHandler);
        
        // Retornamos el primer elemento
        return periodoEstadoHandler;
    }
}