package grupo26diseno.tpdisenogrupo26.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import grupo26diseno.tpdisenogrupo26.model.Reserva;


import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    /**
     * Busca reservas de una habitación específica que se superponen con un rango de fechas dado.
     * @param numeroHabitacion Número de la habitación.
     * @param fechaFinal Fecha límite superior.
     * @param fechaInicio Fecha límite inferior.
     * @return Lista de reservas que se superponen con el rango de fechas dado para la habitación especificada.
     */
    List<Reserva> findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
            long numeroHabitacion, java.time.LocalDate fechaFinal, java.time.LocalDate fechaInicio);

    /**
     * Busca reservas por criterios de apellido y nombres del titular.
     * @param apellido Apellido del titular.
     * @param nombres Nombres del titular.
     * @return Lista de reservas que coinciden con los criterios dados.
     */
    @Query("SELECT r FROM Reserva r WHERE " +
           "(:apellido IS NULL OR r.apellidoReservador LIKE %:apellido%) AND " +
           "(:nombres IS NULL OR r.nombreReservador LIKE %:nombres%) ")
    List<Reserva> buscarPorCriterios(
            @Param("apellido") String apellido,
            @Param("nombres") String nombres);

    /**
     * Busca una reserva por su ID.
     * @param id ID de la reserva.
     * @return La reserva correspondiente al ID.
     */
    Reserva findById(long id);

    
}
