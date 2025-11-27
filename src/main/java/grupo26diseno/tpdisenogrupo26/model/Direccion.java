package grupo26diseno.tpdisenogrupo26.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nombreCalle;
    @Column(nullable = false)
    private int numCalle;
    @Column(nullable = false)
    private String codPostal;
    @Column(nullable = false)
    private String localidad;
    @Column(nullable = false)
    private String provincia;
    @Column(nullable = false)
    private String pais;
    @Column(nullable = true)
    private String piso;
    @Column(nullable = true)
    private String departamento;

    public Direccion(String nombreCalle, int numCalle, String codPostal, String localidad, String pais, String piso, String departamento) {
        this.nombreCalle = nombreCalle;
        this.numCalle = numCalle;
        this.codPostal = codPostal;
        this.localidad = localidad;
        this.pais = pais;
        this.piso = piso;
        this.departamento = departamento;
    }
    public Direccion(String nombreCalle, int numCalle, String codPostal, String localidad, String pais) {
        this.nombreCalle = nombreCalle;
        this.numCalle = numCalle;
        this.codPostal = codPostal;
        this.localidad = localidad;
        this.pais = pais;
    }
}