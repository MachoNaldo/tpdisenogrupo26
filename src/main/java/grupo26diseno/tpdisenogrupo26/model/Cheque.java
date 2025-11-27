package grupo26diseno.tpdisenogrupo26.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Cheque extends MetodoPago {

    @Column(nullable = false)
    private int numCheque;
    
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date fechaEmision;
    
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date fechaCobro;
    
    @Column(nullable = false)
    private String banco;
    
    @Column(nullable = false)
    private int plaza;
    
    @Column(nullable = false)
    private int cotizacion;

    public Cheque(TipoMoneda moneda, int numCheque, Date fechaEmision, Date fechaCobro, String banco, int plaza, int cotizacion) {
        super(moneda);
        this.numCheque = numCheque;
        this.fechaEmision = fechaEmision;
        this.fechaCobro = fechaCobro;
        this.banco = banco;
        this.plaza = plaza;
        this.cotizacion = cotizacion;
    }
}