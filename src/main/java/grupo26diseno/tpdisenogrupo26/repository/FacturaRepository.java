package grupo26diseno.tpdisenogrupo26.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;


import grupo26diseno.tpdisenogrupo26.model.Factura;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {
    /**
     * Obtiene el número de factura más alto registrado actualmente en el sistema.
     * @return El número de factura más alto, o null si no hay facturas.
     */
    @Query("SELECT MAX(f.numero) FROM Factura f")
    Integer buscarNumeroFactura();
}