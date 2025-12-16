package grupo26diseno.tpdisenogrupo26.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity(name = "Responsable_Pago")
@NoArgsConstructor
public class ResponsablePago extends Persona {

    @Column(nullable = false)
    private String razonSocial;

    @OneToMany(mappedBy = "responsablePago")
    private List<NotaCredito> notasCreditoGeneradas;

    public ResponsablePago(String cuit, String telefono, String nacionalidad, Direccion direccion, String razonSocial) {
        super(cuit, telefono, nacionalidad, direccion);
        this.razonSocial = razonSocial;
    }
}