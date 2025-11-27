package grupo26diseno.tpdisenogrupo26.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class PeriodoEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "numero", nullable = false)
    private Habitacion habitacion; 

    @Column(nullable = false)
    private LocalDate fechaInicio;
    
    @Column(nullable = false)
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    private TipoEstadoHabitacion tipoEstado;
}