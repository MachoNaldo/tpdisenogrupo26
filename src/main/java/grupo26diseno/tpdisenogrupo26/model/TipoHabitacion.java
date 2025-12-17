package grupo26diseno.tpdisenogrupo26.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor

public enum TipoHabitacion {
    IndividualEstandar(25000.0),
    DobleEstandar(55000.0),
    DobleSuperior(75000.0),
    SuperiorFamilyPlan(85000.0),
    SuiteDoble(155000.0);

    private final double precioBase;

}
