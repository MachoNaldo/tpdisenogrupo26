package grupo26diseno.tpdisenogrupo26.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponsablePagoDTO {

    private Long id;
    private String cuit;
    private String razonSocial;
    private DireccionDTO direccion;
    private String telefono;
    private String nacionalidad;
}
