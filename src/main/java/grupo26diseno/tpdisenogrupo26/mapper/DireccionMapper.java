package grupo26diseno.tpdisenogrupo26.mapper;

import org.springframework.stereotype.Component;
import grupo26diseno.tpdisenogrupo26.dtos.DireccionDTO;
import grupo26diseno.tpdisenogrupo26.model.Direccion;

@Component
public class DireccionMapper {
    public Direccion crearEntidad(DireccionDTO dto) {
        Direccion d = new Direccion();
        d.setCodPostal(dto.getCodPostal());
        d.setDepartamento(dto.getDepartamento());
        d.setLocalidad(dto.getLocalidad());
        d.setNombreCalle(dto.getNombreCalle());
        d.setNumCalle(dto.getNumCalle());
        d.setPais(dto.getPais());
        d.setPiso(dto.getPiso());
        d.setProvincia(dto.getProvincia());
        return d;
    }
}