package DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class EstadiaDTO {
   
    private List<HabitacionOcupadaDTO> habitaciones;


    // Clase interna de cada habitación ocupada
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HabitacionOcupadaDTO {
        private String tipoHabitacionId;
        private String tipoHabitacionNombre;
        private long numeroHabitacion;
        private String fechaInicio;
        private String fechaFin;
        private HuespedDTO ocupante;
        private List<HuespedDTO> acompanantes;
    }
}
