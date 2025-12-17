package grupo26diseno.tpdisenogrupo26.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;

@Repository
public interface ResponsablePagoRepository extends JpaRepository<ResponsablePago, Long> {

    /**
     * Busca un responsable de pago por su CUIT.
     * @param cuit CUIT del responsable de pago.
     * @return Optional con el responsable si existe.
     */
    Optional<ResponsablePago> findByCuit(String cuit);

    /**
     * Verifica si existe un responsable de pago con el CUIT dado.
     * @param cuit CUIT del responsable de pago.
     * @return true si existe, false en caso contrario.
     */
    boolean existsByCuit(String cuit);
}
