package grupo26diseno.tpdisenogrupo26.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrearFacturaRequest {
    private Long estadiaId;
    private Long personaId;
    private Boolean incluirEstadia;
    private Boolean incluirConsumos;
}