package DTOs;

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
    
    // Clase interna con datos del cliente
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ClienteDTO {
        private String nombre;
        private String apellido;
        private String telefono;
    }
    // Clase interna con datos de la reserva para cada habitación
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HabitacionReservaDTO {
        private String tipoHabitacionNombre;
        private Integer numeroHabitacion;
        private String fechaInicio; 
        private String fechaFin;  
    }
}
