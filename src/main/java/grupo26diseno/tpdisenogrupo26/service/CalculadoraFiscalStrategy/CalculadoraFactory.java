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

    public CalculadoraFiscalStrategy obtenerEstrategia(Persona persona) {
        if (persona == null) return calculadoraB;
        String cuit = persona.getCuit();
        boolean esFacturaA = cuit != null && cuit.replaceAll("\\D", "").length() == 11;

        return esFacturaA ? calculadoraA : calculadoraB;
    }
}