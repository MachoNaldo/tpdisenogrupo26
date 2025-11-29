package grupo26diseno.tpdisenogrupo26.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;

@Repository
public interface PeriodoRepository extends JpaRepository<PeriodoEstado, Long> {

    // Para buscar periodos que se superponen
    List<PeriodoEstado> findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            Long habitacionId,
            LocalDate fechaFin,
            LocalDate fechaInicio
    );

    boolean existsByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            Long habitacionId,
            LocalDate fechaFin,
            LocalDate fechaInicio
    );

    boolean existsByHabitacionNumeroAndFechaInicio(Long numero, LocalDate fechaInicio);
}
