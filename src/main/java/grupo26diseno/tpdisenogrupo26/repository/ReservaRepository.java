package grupo26diseno.tpdisenogrupo26.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

//import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
//import grupo26diseno.tpdisenogrupo26.model.TipoDoc;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
            long numeroHabitacion, java.time.LocalDate fechaFinal, java.time.LocalDate fechaInicio);

    @Query("SELECT r FROM Reserva r WHERE " +
           "(:apellido IS NULL OR r.apellidoReservador LIKE %:apellido%) AND " +
           "(:nombres IS NULL OR r.nombreReservador LIKE %:nombres%) ")
    List<Reserva> buscarPorCriterios(
            @Param("apellido") String apellido,
            @Param("nombres") String nombres);
    Reserva findById(long id);
}
