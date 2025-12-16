package grupo26diseno.tpdisenogrupo26.dtos;

import grupo26diseno.tpdisenogrupo26.model.CondicionFiscal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActualizarCuitCondicionFiscalDTO {

    private String cuit;
    private CondicionFiscal condicionFiscal;
}