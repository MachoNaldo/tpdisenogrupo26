package grupo26diseno.tpdisenogrupo26.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Habitacion {

    @Id
    private Long numero;

    @Enumerated(EnumType.STRING)
    private TipoHabitacion tipo;

    @OneToMany(
        mappedBy = "habitacion",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<PeriodoEstado> periodos = new ArrayList<>();
}
