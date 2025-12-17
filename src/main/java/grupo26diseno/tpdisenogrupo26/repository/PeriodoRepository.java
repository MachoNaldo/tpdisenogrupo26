package grupo26diseno.tpdisenogrupo26.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.PeriodoEstado;

@Repository
public interface PeriodoRepository extends JpaRepository<PeriodoEstado, Long> {

    /**
     * Busca periodos de estado que se superponen con un rango de fechas dado para una habitación específica.
     * <p>
     * Se utiliza para pintar el calendario de disponibilidad y saber qué días
     * la habitación está bloqueada por mantenimiento o limpieza.
     * </p>
     * @param habitacionId ID de la habitación a verificar.
     * @param fechaFin Fecha límite superior.
     * @param fechaInicio Fecha límite inferior.
     * @return Lista de periodos que coinciden con los criterios.
     */ 
    List<PeriodoEstado> findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            Long habitacionId,
            LocalDate fechaFin,
            LocalDate fechaInicio
    );

    /**
     * Verifica si existen periodos de estado que se superponen con un rango de fechas dado para una habitación específica.
     * @param habitacionId ID de la habitación a verificar.
     * @param fechaFin Fecha límite superior.
     * @param fechaInicio Fecha límite inferior.
     * @return true si existen periodos que se superponen, false en caso contrario.
     */
    boolean existsByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinGreaterThanEqual(
            Long habitacionId,
            LocalDate fechaFin,
            LocalDate fechaInicio
    );

    /**
     * Verifica si existe un periodo de estado que comienza en una fecha específica para una habitación dada.
     * @param numero Número de la habitación.
     * @param fechaInicio Fecha de inicio del periodo.
     * @return true si existe un periodo con esa fecha de inicio, false en caso contrario.
     */
    boolean existsByHabitacionNumeroAndFechaInicio(Long numero, LocalDate fechaInicio);
}
