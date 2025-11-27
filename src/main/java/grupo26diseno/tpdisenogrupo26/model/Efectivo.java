package grupo26diseno.tpdisenogrupo26.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Efectivo extends MetodoPago {

    @Column(nullable = false)
    private int vuelto;

    public Efectivo(TipoMoneda moneda, int vuelto) {
        super(moneda);
        this.vuelto = vuelto;
    }
}