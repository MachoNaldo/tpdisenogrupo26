package grupo26diseno.tpdisenogrupo26.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;


import grupo26diseno.tpdisenogrupo26.model.Factura;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    @Query("SELECT MAX(f.numero) FROM Factura f")
    Integer buscarNumeroFactura();
}