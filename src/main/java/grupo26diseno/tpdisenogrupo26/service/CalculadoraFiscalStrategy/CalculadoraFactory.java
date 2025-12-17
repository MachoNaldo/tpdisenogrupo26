package grupo26diseno.tpdisenogrupo26.service.CalculadoraFiscalStrategy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import grupo26diseno.tpdisenogrupo26.model.Persona;

@Component
public class CalculadoraFactory {

    @Autowired
    @Qualifier("calculadoraA")
    private CalculadoraFiscalStrategy calculadoraA;

    @Autowired
    @Qualifier("calculadoraB")
    private CalculadoraFiscalStrategy calculadoraB;

    /**
     * Obtiene la estrategia de cálculo fiscal adecuada según la información de la persona.
     * @param persona La entidad responsable del pago, puede ser null.
     * @return Estrategia de cálculo fiscal correspondiente (Factura A o B).
     */
    public CalculadoraFiscalStrategy obtenerEstrategia(Persona persona) {
        if (persona == null) return calculadoraB;
        String cuit = persona.getCuit();
        boolean esFacturaA = cuit != null && cuit.replaceAll("\\D", "").length() == 11;

        return esFacturaA ? calculadoraA : calculadoraB;
    }
}