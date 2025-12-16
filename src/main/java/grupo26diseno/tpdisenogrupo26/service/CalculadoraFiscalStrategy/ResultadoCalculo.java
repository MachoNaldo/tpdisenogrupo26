package grupo26diseno.tpdisenogrupo26.service.CalculadoraFiscalStrategy;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor

public class ResultadoCalculo {
    private double neto;
    private double iva;
    private double total;
    private String letraFactura; // "A" o "B"
}