package grupo26diseno.tpdisenogrupo26.service.CalculadoraFiscalStrategy;

public interface CalculadoraFiscalStrategy {
    /**
     * Calcula los impuestos y el monto total a pagar
     * @param montoBaseNeto Monto base neto sobre el cual se aplican los cálculos fiscales.
     * @return ResultadoCalculo con el desglose de importes y el tipo de comprobante (A/B).
     */
    ResultadoCalculo calcular(double montoBaseNeto);
}