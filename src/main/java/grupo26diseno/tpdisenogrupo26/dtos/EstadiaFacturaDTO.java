package grupo26diseno.tpdisenogrupo26.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EstadiaFacturaDTO {
    private Long id;
    private String fechaCheckIn;
    private String fechaCheckOut;
    private Integer cantidadNoches;
    private double precioTotal;

    private HabitacionFacturaDTO habitacion;
    private HuespedDTO huespedPrincipal;
    private List<HuespedDTO> acompanantes;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class HabitacionFacturaDTO {
        private long numero;
        private String tipo;
        private double precioPorNoche;
    }
}