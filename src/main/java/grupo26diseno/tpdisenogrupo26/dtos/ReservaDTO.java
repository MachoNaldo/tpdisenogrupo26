package grupo26diseno.tpdisenogrupo26.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservaDTO {

    private ClienteDTO cliente;
    private List<HabitacionReservaDTO> reservas;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClienteDTO {
        private String nombre;
        private String apellido;
        private String telefono;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HabitacionReservaDTO {
        private Integer numeroHabitacion;
        private String fechaInicio;
        private String fechaFin;
    }
}
