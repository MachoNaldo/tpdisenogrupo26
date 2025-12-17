package grupo26diseno.tpdisenogrupo26.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Estadia;

@Repository
public interface EstadiaRepository extends JpaRepository<Estadia, Long> {
    
       /**
        * Busca las estadías que interceptan con el rango de fechas dado para una habitación específica.
        * @param habitacionId ID de la habitación a verificar.
        * @param fechaFin Fecha límite superior.
        * @param fechaInicio Fecha límite inferior.
        * @return Lista de estadías que coinciden con los criterios.
        */
       List<Estadia> findByHabitacionNumeroAndFechaCheckInLessThanEqualAndFechaCheckOutGreaterThanEqual(
            Long habitacionId,
            LocalDate fechaFin,
            LocalDate fechaInicio
    );

    // Existe algún registro de estadía donde el huésped principal o algún acompañante tenga el ID dado
    /**
     * Verifica si un huésped (principal o acompañante) tiene alguna estadía registrada.
     * @param huespedId ID del huésped a verificar.
     * @return true si el huésped tiene alguna estadía, false en caso contrario.
     */
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
           "FROM Estadia e " +
           "LEFT JOIN e.acompanantes a " +
           "WHERE e.huespedPrincipal.id = :huespedId OR a.id = :huespedId")
    boolean existeHuespedEnEstadias(@Param("huespedId") Long huespedId);

    /**
     * Busca la estadía para facturación basada en el número de habitación y la fecha de salida.
     * Utiliza <b>JOIN FETCH</b> para cargar en una sola consulta al Huésped Principal, 
     * la Habitación y la lista de Acompañantes.
     * @param nroHabitacion Número de la habitación que se está facturando.
     * @param fechaSalida Fecha de salida de la estadía.
     * @return La entidad Estadia con todas sus relaciones cargadas.
     */
    @Query("SELECT e FROM Estadia e " +
       "JOIN FETCH e.huespedPrincipal " +   
       "JOIN FETCH e.habitacion " +  
       "LEFT JOIN FETCH e.acompanantes " +
       "WHERE e.habitacion.numero = :nroHabitacion " +
       "AND :fechaSalida BETWEEN e.fechaCheckIn AND e.fechaCheckOut")//no toma directamente la fecha de salida, sino el rango
Estadia buscarParaFacturar(@Param("nroHabitacion") Long nroHabitacion, 
                           @Param("fechaSalida") LocalDate fechaSalida);

}
