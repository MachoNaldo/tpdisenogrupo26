package grupo26diseno.tpdisenogrupo26.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;





@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstadiaDTO {


    private List<HabitacionOcuparDTO> estadias;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HabitacionOcuparDTO {
        private Integer numeroHabitacion;
        private String fechaInicio;
        private String fechaFin;
        private HuespedDTO huespedPrincipal;
        private List<HuespedDTO> acompanantes;
    }
}
