package grupo26diseno.tpdisenogrupo26.model;

import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
//import lombok.ToString;



@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Estadia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private LocalDate fechaCheckIn;
    
    @Temporal(TemporalType.DATE)
    @Column(nullable = true) 
    private LocalDate fechaCheckOut;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "numero_habitacion", referencedColumnName = "numero", nullable = false)
    //@ToString.Exclude
    private Habitacion habitacion;

    @OneToMany(mappedBy = "estadia")
    private List<Factura> facturas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "huesped_principal_id", nullable = false)
    //@ToString.Exclude
    private Huesped huespedPrincipal; 

    @ManyToMany
    @JoinTable(
       name = "estadia_acompanantes",
       joinColumns = @JoinColumn(name = "estadia_id"),
       inverseJoinColumns = @JoinColumn(name = "huesped_id")
    )
    private List<Huesped> acompanantes = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "estadia_servicio",
        joinColumns = @JoinColumn(name = "estadia_id"),
        inverseJoinColumns = @JoinColumn(name = "servicio_id")
    )
    private List<Servicio> serviciosConsumidos;
}