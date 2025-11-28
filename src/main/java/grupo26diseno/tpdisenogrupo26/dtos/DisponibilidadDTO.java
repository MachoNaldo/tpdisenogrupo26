package grupo26diseno.tpdisenogrupo26.dtos;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DisponibilidadDTO {
    private Long numeroHabitacion;
    private String tipoHabitacion;
    private Map<String, String> estados;
}
