package grupo26diseno.tpdisenogrupo26.service.handler;

import java.time.LocalDate;
import java.util.Map;

import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;

/*
  Handler base para la cadena de responsabilidad
  que procesa el estado de una habitación en un rango de fechas
 */
public abstract class EstadoHabitacionHandler {
    
    protected EstadoHabitacionHandler siguiente;
    
    /*
     * Establece el siguiente Handler en la cadena
     */
    public EstadoHabitacionHandler setSiguiente(EstadoHabitacionHandler siguiente) {
        this.siguiente = siguiente;
        return siguiente;
    }
    

     // Procesa el estado de la habitacion y delega al siguiente si existe
    public void procesar(Long numeroHabitacion, LocalDate desde, LocalDate hasta, 
                        Map<String, String> mapaEstados) {
        
        // Procesamiento específico de este Handler
        procesarEstados(numeroHabitacion, desde, hasta, mapaEstados);
        
        // Delegar al siguiente en la cadena si existe
        if (siguiente != null) {
            siguiente.procesar(numeroHabitacion, desde, hasta, mapaEstados);
        }
    }
    
    // Metodo abstracto que cada Handler concreto debe implementar
    protected abstract void procesarEstados(Long numeroHabitacion, LocalDate desde, 
                                           LocalDate hasta, Map<String, String> mapaEstados);
    
    // Metodo auxiliar para llenar el mapa con un estado en un rango de fechas
    protected void llenarMapa(Map<String, String> mapa, LocalDate fechaInicio, 
                             LocalDate fechaFin, TipoEstadoHabitacion estado) {
        LocalDate fecha = fechaInicio;
        while (!fecha.isAfter(fechaFin)) {
            mapa.put(fecha.toString(), estado.name());
            fecha = fecha.plusDays(1);
        }
    }
}