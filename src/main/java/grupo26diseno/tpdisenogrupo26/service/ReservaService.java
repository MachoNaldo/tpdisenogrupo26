package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;


import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;


public interface ReservaService {
    /**
     * Obtiene el listado de reservas activas para una habitación específica en un rango de fechas.
     * @param numeroHabitacion Número identificador de la habitación.
     * @param fechaInicio Fecha de inicio del rango de búsqueda.
     * @param fechaFin Fecha de fin del rango de búsqueda.
     * @return Lista de reservas encontradas en ese período.
     */
    List<ReservaDTO> obtenerReservasPorHabitacionYFecha(long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin);

    /**
     * Busca reservas asociadas a un titular específico mediante su nombre o apellido.
     * @param apellido Apellido del titular.
     * @param nombres Nombre o nombres del titular.
     * @return Lista de reservas que coinciden con los criterios.
     */
    List<ReservaDTO> buscarReservaPorCriterios(String apellido, String nombres);

    /**
     * Cancela una reserva existente.
     * @param idReserva ID único de la reserva a cancelar.
     */
    void cancelarReserva(Long idReserva);


}

