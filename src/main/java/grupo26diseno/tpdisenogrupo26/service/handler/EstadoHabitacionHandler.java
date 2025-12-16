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
    

    /**
     * Establece el siguiente Handler en la cadena.
     * @param siguiente El handler que se ejecutará después del actual.
     * @return El handler asignado
     */
    public EstadoHabitacionHandler setSiguiente(EstadoHabitacionHandler siguiente) {
        this.siguiente = siguiente;
        return siguiente;
    }
    

     // 
     /**
      * Procesa el estado de la habitacion y delega al siguiente si existe
      * @param numeroHabitacion ID de la habitación.
      * @param desde Fecha de inicio del rango.
      * @param hasta Fecha de fin del rango.
      * @param mapaEstados Mapa acumulativo donde se guardan los estados.
      */
    public void procesar(Long numeroHabitacion, LocalDate desde, LocalDate hasta, 
                        Map<String, String> mapaEstados) {
        
        // Procesamiento específico de este Handler
        procesarEstados(numeroHabitacion, desde, hasta, mapaEstados);
        
        // Delegar al siguiente en la cadena si existe
        if (siguiente != null) {
            siguiente.procesar(numeroHabitacion, desde, hasta, mapaEstados);
        }
    }
    

    /** Metodo abstracto que cada Handler concreto debe implementar.
     * Busca en la base de datos las reservas que interceptan con el rango de fechas solicitado.
     * @param numeroHabitacion ID de la habitación sobre la cual se consulta la disponibilidad.
     * @param desde Fecha de inicio del rango de consulta.
     * @param hasta Fecha de fin del rango de consulta.
     * @param mapaEstados Mapa acumulativo donde se registran los estados por fecha.
     */
    protected abstract void procesarEstados(Long numeroHabitacion, LocalDate desde, 
                                           LocalDate hasta, Map<String, String> mapaEstados);
    
    // Metodo auxiliar para llenar el mapa con un estado en un rango de fechas
    /**
     * Método auxiliar para rellenar el mapa día por día dentro de un rango.
     * @param mapa Mapa de estados a modificar.
     * @param fechaInicio Fecha de inicio del rango.
     * @param fechaFin Fecha de fin del rango.
     * @param estado Estado a asignar en cada día del rango.
     */
    protected void llenarMapa(Map<String, String> mapa, LocalDate fechaInicio, 
                             LocalDate fechaFin, TipoEstadoHabitacion estado) {
        LocalDate fecha = fechaInicio;
        while (!fecha.isAfter(fechaFin)) {
            mapa.put(fecha.toString(), estado.name());
            fecha = fecha.plusDays(1);
        }
    }
}