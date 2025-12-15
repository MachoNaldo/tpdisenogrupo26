package grupo26diseno.tpdisenogrupo26.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;

@Repository
public interface ResponsablePagoRepository extends JpaRepository<ResponsablePago, Long> {

    Optional<ResponsablePago> findByCuit(String cuit);

    boolean existsByCuit(String cuit);
}
