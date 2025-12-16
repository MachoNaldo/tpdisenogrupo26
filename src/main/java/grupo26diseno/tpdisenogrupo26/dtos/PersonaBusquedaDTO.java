package grupo26diseno.tpdisenogrupo26.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class PersonaBusquedaDTO {
    
    private Long id;
    private String cuit;
    private String tipo; 
    
    // Para huesped
    private String nombres;
    private String apellido;
    private String documentacion;
    
    // Para responsable de pago
    private String razonSocial;
    
    private String direccion;
    private String telefono;
    private String nacionalidad;
}