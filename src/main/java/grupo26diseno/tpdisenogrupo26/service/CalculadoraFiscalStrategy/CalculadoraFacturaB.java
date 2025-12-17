package grupo26diseno.tpdisenogrupo26.service.CalculadoraFiscalStrategy;

import org.springframework.stereotype.Component;

@Component("calculadoraB")
public class CalculadoraFacturaB implements CalculadoraFiscalStrategy {

    private static final double TASA_IVA = 0.21;
    /** 
     * Calcula los montos aplicando el 21% de IVA sobre el básico.
     * @param montoBase Monto base neto sobre el cual se aplican los cálculos fiscales.
     * @return ResultadoCalculo con el desglose de importes y el tipo de comprobante "B".
     */
    @Override
    public ResultadoCalculo calcular(double montoBase) {
        double iva = montoBase * TASA_IVA;
        double total = montoBase + iva;

        double netoRedondeado = redondear(montoBase);
        double ivaRedondeado = redondear(iva);
        double totalRedondeado = redondear(total);


        return new ResultadoCalculo(netoRedondeado, ivaRedondeado, totalRedondeado, "B");
    }

    private double redondear(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}