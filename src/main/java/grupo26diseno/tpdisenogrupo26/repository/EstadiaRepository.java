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
    List<Estadia> findByHabitacionNumeroAndFechaCheckInLessThanEqualAndFechaCheckOutGreaterThanEqual(
            Long habitacionId,
            LocalDate fechaFin,
            LocalDate fechaInicio
    );

    // Existe algún registro de estadía donde el huésped principal o algún acompañante tenga el ID dado
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END " +
           "FROM Estadia e " +
           "LEFT JOIN e.acompanantes a " +
           "WHERE e.huespedPrincipal.id = :huespedId OR a.id = :huespedId")
    boolean existeHuespedEnEstadias(@Param("huespedId") Long huespedId);

    @Query("SELECT e FROM Estadia e " +
       "JOIN FETCH e.huespedPrincipal " +   
       "JOIN FETCH e.habitacion " +  
       "LEFT JOIN FETCH e.acompanantes " +
       "WHERE e.habitacion.numero = :nroHabitacion " +
       "AND :fechaSalida BETWEEN e.fechaCheckIn AND e.fechaCheckOut")//no toma directamente la fecha de salida, sino el rango
Estadia buscarParaFacturar(@Param("nroHabitacion") Long nroHabitacion, 
                           @Param("fechaSalida") LocalDate fechaSalida);

}
