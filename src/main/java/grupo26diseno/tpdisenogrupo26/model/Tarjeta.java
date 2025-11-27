package grupo26diseno.tpdisenogrupo26.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Tarjeta extends MetodoPago {

    @Column(nullable = false)
    private int numTarjeta;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoTarjeta tipo;
    
    public Tarjeta(TipoMoneda moneda, int numTarjeta, TipoTarjeta tipo) {
        super(moneda);
        this.numTarjeta = numTarjeta;
        this.tipo = tipo;
    }
}