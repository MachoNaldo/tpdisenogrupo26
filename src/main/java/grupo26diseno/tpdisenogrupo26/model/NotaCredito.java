package grupo26diseno.tpdisenogrupo26.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Nota_Credito")
public class NotaCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private int numero;
    
    @Column(nullable = false)
    private float importeNeto;
    
    @Column(nullable = false)
    private int iva;
    
    @Column(nullable = false)
    private float montoTotal;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_pago_id", nullable = false)
    private ResponsablePago responsablePago;

    @OneToMany(mappedBy = "notaCreditoCompensada")
    private List<Factura> facturasCompensadas;
}