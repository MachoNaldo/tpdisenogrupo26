package grupo26diseno.tpdisenogrupo26.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private LocalDate fechaInicio;
    @Column(nullable = false)
    private LocalDate fechaFinal;
    
    @Column(nullable = false)
    private String nombreReservador;
    @Column(nullable = false)
    private String apellidoReservador;
    @Column(nullable = false)
    private String telefonoReservador;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "numero_habitacion", nullable = false)
    private Habitacion habitacion;
}