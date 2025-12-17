package grupo26diseno.tpdisenogrupo26.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.Habitacion;

@Repository
public interface HabitacionRepository extends JpaRepository<Habitacion, Long> {
    /**
     * Busca una habitación por su número.
     * @param numero Número de la habitación.
     * @return Una habitación que coincida con el número dado, o vacío si no existe.
     */
    Optional<Habitacion> findByNumero(Long numero);
    
    /**
     * Verifica si existe una habitación con el número dado.
     * @param numero Número de la habitación.
     * @return true si existe una habitación con ese número, false en caso contrario.
     */
    boolean existsByNumero(Long numero);

    /**
     * Recupera todas las habitaciones cargando también sus periodos de bloqueo/mantenimiento.
     * @return Lista de habitaciones con sus periodos cargados.
     */
    @Query("""
           SELECT h FROM Habitacion h
           LEFT JOIN FETCH h.periodos
           """)
    List<Habitacion> findAllConPeriodos();

    /**
     * Recupera una habitación por su número, cargando también sus periodos de bloqueo/mantenimiento.
     * @param numero Número de la habitación.
     * @return Una habitación que coincida con el número dado, o vacío si no existe.
     */
    @Query("""
           SELECT h FROM Habitacion h
           LEFT JOIN FETCH h.periodos
           WHERE h.numero = :numero
           """)
    Optional<Habitacion> findByNumeroConPeriodos(Long numero);

    /**
     * Obtiene una lista con todos los números de habitación existentes.
     * @return Lista de números de habitación.
     */
    @Query("SELECT h.numero FROM Habitacion h ORDER BY h.numero ASC")
    List<Long> findAllNumeros();
}
