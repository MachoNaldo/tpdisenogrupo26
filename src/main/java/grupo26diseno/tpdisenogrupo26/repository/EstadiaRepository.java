package grupo26diseno.tpdisenogrupo26.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import grupo26diseno.tpdisenogrupo26.model.Estadia;

@Repository
public interface EstadiaRepository extends JpaRepository<Estadia, Long> {
    List<Estadia> findByHabitacionNumeroAndFechaCheckInLessThanEqualAndFechaCheckOutGreaterThanEqual(
            Long habitacionId,
            LocalDate fechaFin,
            LocalDate fechaInicio
    );

}
