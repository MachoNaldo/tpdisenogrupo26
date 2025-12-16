package grupo26diseno.tpdisenogrupo26.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FacturaDTO {
    private Long id;
    private Integer numero;
    private double importeTotal;
    private String estado; // PENDIENTE, PAGADA, ANULADA
    private LocalDate fechaConfeccion;
    private double importeNeto;
    private double iva;
    private String tipoFactura; // A o B
    
    private ResponsablePagoSimpleDTO responsablePago;
    private EstadiaSimpleDTO estadia;
    private List<DetalleFacturaDTO> detalles;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ResponsablePagoSimpleDTO {
        private Long id;
        private String razonSocial;
        private String cuit;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class EstadiaSimpleDTO {
        private Long id;
        private long numeroHabitacion;
        private LocalDate fechaCheckIn;
        private LocalDate fechaCheckOut;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DetalleFacturaDTO {
        private String concepto;
        private Integer cantidad;
        private double precioUnitario;
        private double subtotal;
    }
}