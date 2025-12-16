package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;

import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;

public interface PeriodoEstadoService {

    /**
     * Registra un nuevo bloqueo de fechas por una reserva futura.
     * @param habitacion La habitación afectada.
     * @param fechaInicio Inicio del bloqueo.
     * @param fechaFin Fin del bloqueo.
     */
    void crearPeriodoEstadoReservado(Habitacion habitacion, LocalDate fechaInicio, LocalDate fechaFin);
    /**
     * Recupera todos los periodos en un rango dado.
     * @param numeroHabitacion ID de la habitación.
     * @param fechaFin Fin del rango a consultar.
     * @param fechaInicio Inicio del rango a consultar.
     * @return Lista de periodos.
     */
    List<PeriodoEstado> obtenerPeriodosEstadoEnRango(Long numeroHabitacion, LocalDate fechaFin, LocalDate fechaInicio);
    /**
     * Verifica si existen periodos de estado en un rango dado.
     * @param numeroHabitacion ID de la habitación a verificar
     * @param fechaFin Fecha de fin del rango solicitado.
     * @param fechaInicio Fecha de inicio del rango solicitado.
     * @return true si hay solapamiento, false si está libre.
     */
    boolean existePeriodoEstadoEnRango(Long numeroHabitacion, LocalDate fechaFin, LocalDate fechaInicio);
    /**
     * Valida la disponibilidad de una habitación en un rango de fechas, ignorando reservas existentes.
     * @param numeroHabitacion ID de la habitación.
     * @param fechaInicio Fecha de inicio.
     * @param fechaFin Fecha de fin.
     * @throws DisponibilidadException Si la habitación está OCUPADA o FUERA_DE_SERVICIO.
     */
    void validarDisponibilidadIgnorandoReservas(Long numeroHabitacion, LocalDate fechaInicio, LocalDate fechaFin) throws DisponibilidadException;
    /**
     * Crea un periodo de estado OCUPADO para una habitación en un rango de fechas.
     * @param habitacion La habitación a ocupar.
     * @param fInicio Fecha de inicio de la ocupación.
     * @param fFin Fecha de fin de la ocupación.
     */
    void crearPeriodoEstadoOcupado(Habitacion habitacion,LocalDate fInicio, LocalDate fFin);
}
