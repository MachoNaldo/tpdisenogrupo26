package grupo26diseno.tpdisenogrupo26.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@NoArgsConstructor
@AllArgsConstructor

public class Huesped extends Persona {

    @Column(nullable = false)
    private String nombres;
    @Column(nullable = false)
    private String apellido;
    @Column(nullable = false)
    private int edad;
    @Enumerated(EnumType.STRING)
    private TipoSexo sexo;
    @Enumerated(EnumType.STRING)
    private TipoDoc tipoDocumento;
    @Column(nullable = false)
    private String documentacion;
    @Temporal(TemporalType.DATE)
    private Date fechaNacimiento;
    @Enumerated(EnumType.STRING)
    private TipoConsumidor consumidorFinal;
    @Column(nullable = true)
    private String email;
    @Column(nullable = false)
    private String ocupacion;
    
    //ya se hospedo en el hotel
    @Column
    private boolean hospedado=false;

}
