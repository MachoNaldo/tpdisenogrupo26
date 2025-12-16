package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import grupo26diseno.tpdisenogrupo26.dtos.DisponibilidadDTO;
import grupo26diseno.tpdisenogrupo26.dtos.EstadiaDTO;
import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;


public interface HabitacionService{
    /**
     * Calcula día por día el estado de una habitación en un rango de fechas.
     * @param numeroHabitacion El número identificador de la habitación.
     * @param fechaInicio Fecha de inicio de la consulta.
     * @param fechaFin Fecha de fin de la consulta.
     * @return Un Mapa donde la clave es la fecha y el valor es el estado (LIBRE, OCUPADA, MANTENIMIENTO).
     */
    Map<LocalDate, TipoEstadoHabitacion> obtenerEstadosHabitacionEnPeriodo(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin);
    /**
     * Valida la disponibilidad de una habitación en un período dado.
     * @param numeroHabitacion El número identificador de la habitación.
     * @param fechaInicio Fecha de inicio del periodo a consultar.
     * @param fechaFin Fecha de fin del periodo a consultar.
     * @throws DisponibilidadException Si la habitación no está disponible.
     */
    void validarDisponibilidad(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) throws DisponibilidadException;
   /**
     * Registra la ocupación de una o varias habitaciones.
     * Asigna huéspedes principales y acompañantes, y persiste la estadía.
     * @param estadiaDTO Contiene la lista de habitaciones a ocupar y los datos de los huéspedes.
     * @param forzar Si es true, permite la ocupación ignorando reservas solapadas, eliminandolas para no causar conflictos.
     * Si es false, lanza excepción en caso de solapamiento.
     * @throws DisponibilidadException Si la habitación está ocupada y no se forzó la operación.
     */
    public void ocuparHabitacion(EstadiaDTO estadiaDTO, boolean forzar) throws DisponibilidadException;
    /**
     * Crea una nueva reserva para un cliente.
     * Valida disponibilidad antes de confirmar.
     * @param dto Datos del cliente y las habitaciones a reservar.
     * @throws DisponibilidadException Si alguna de las habitaciones ya está reservada o bloqueada en las fechas deseadas.
     */
    public void crearReserva(ReservaDTO dto) throws DisponibilidadException;
    /**
     * Obtiene la disponibilidad de habitaciones en un período dado y sus estados.
     * @param desde Fecha de inicio de búsqueda.
     * @param hasta Fecha de fin de búsqueda.
     * @return Una lista de DTOs con la información de disponibilidad de cada habitación.
     */
    List<DisponibilidadDTO> obtenerDisponibilidad(LocalDate desde, LocalDate hasta);
    /**
     * Verifica si existe una habitación con el número dado.
     * @param numero El número identificador de la habitación.
     * @return true si la habitación existe en base de datos, false si no.
     */
    boolean existeNumero (Long numero);
    /**
     * Lista todos los números de habitaciones que hay registrados en el sistema.
     * @return Una lista de números de habitación.
     */
    public List<Long> listarNumeros();
    
}
