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


    @Query("SELECT e FROM Estadia e " +
           "JOIN FETCH e.huespedPrincipal " +   
           "LEFT JOIN FETCH e.acompanantes " +  
           "WHERE e.habitacion.numero = :nroHabitacion " +
           "AND e.fechaCheckOut = :fechaSalida")
    Estadia buscarParaFacturar(@Param("nroHabitacion") Long nroHabitacion, 
                               @Param("fechaSalida") LocalDate fechaSalida);

}
