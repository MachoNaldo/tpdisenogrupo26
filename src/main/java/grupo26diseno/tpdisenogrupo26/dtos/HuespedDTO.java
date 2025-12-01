package grupo26diseno.tpdisenogrupo26.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class HuespedDTO {
    private Long id;
    private String apellido;
    private String consumidorFinal;
    private String cuit;
    private DireccionDTO direccion;
    private String documentacion;
    private String email;
    private LocalDate fechaNacimiento; 
    private String nacionalidad;
    private String nombres;
    private String ocupacion;
    private String sexo;
    private String telefono;
    private String tipoDocumento;
}
