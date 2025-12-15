package grupo26diseno.tpdisenogrupo26.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Habitacion;

@Repository
public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {

    Optional<Habitacion> findByNumero(Long numero);

    boolean existsByNumero(Long numero);

    @Query("""
           SELECT h FROM Habitacion h
           LEFT JOIN FETCH h.periodos
           """)
    List<Habitacion> findAllConPeriodos();

    @Query("""
           SELECT h FROM Habitacion h
           LEFT JOIN FETCH h.periodos
           WHERE h.numero = :numero
           """)
    Optional<Habitacion> findByNumeroConPeriodos(Long numero);
}
