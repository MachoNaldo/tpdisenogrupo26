package grupo26diseno.tpdisenogrupo26.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DireccionDTO {
    private String codPostal;
    private String departamento;
    private String localidad;
    private String nombreCalle;
    private int numCalle;
    private String pais;
    private String piso;
    private String provincia;


}