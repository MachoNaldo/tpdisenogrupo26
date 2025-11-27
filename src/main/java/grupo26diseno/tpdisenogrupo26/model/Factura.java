package grupo26diseno.tpdisenogrupo26.model;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 
    
    @Column(nullable = false, unique = true)
    private int numero;
    
    @Column(nullable = false)
    private int importeTotal;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoFactura estado;
    
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date fechaConfeccion;
    
    @Column(nullable = false)
    private int importeNeto;
    
    @Column(nullable = false)
    private int iva;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_pago_id", nullable = false)
    private ResponsablePago responsablePago;

    @OneToMany(mappedBy = "factura")
    private List<Pago> pagos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estadia_id", nullable = false)
    private Estadia estadia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nota_credito_id", nullable = true)
    private NotaCredito notaCreditoCompensada;
}