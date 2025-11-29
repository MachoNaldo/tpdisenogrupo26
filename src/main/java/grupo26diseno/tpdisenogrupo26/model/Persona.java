package grupo26diseno.tpdisenogrupo26.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

@MappedSuperclass
public abstract class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = true)
    private String cuit;
    @Column(nullable = false)
    private String telefono;
    @Column(nullable = false)
    private String nacionalidad;
    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "direccion_id", referencedColumnName = "id")
    private Direccion direccion;

    public Persona(String cuit, String telefono, String nacionalidad, Direccion direccion) {
        this.cuit = cuit;
        this.telefono = telefono;
        this.nacionalidad = nacionalidad;
        this.direccion = direccion;
    }
    
    public String getNacionalidad(){
        return nacionalidad;
    }
    
    
}
