package grupo26diseno.tpdisenogrupo26.mapper;

import org.springframework.stereotype.Component;
import grupo26diseno.tpdisenogrupo26.dtos.DireccionDTO;
import grupo26diseno.tpdisenogrupo26.model.Direccion;

@Component
public class DireccionMapper {

    public Direccion crearEntidad(DireccionDTO dto) {
        if (dto == null) return null;

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

    public DireccionDTO crearDTO(Direccion d) {
        if (d == null) return null;

        DireccionDTO dto = new DireccionDTO();
        dto.setCodPostal(d.getCodPostal());
        dto.setDepartamento(d.getDepartamento());
        dto.setLocalidad(d.getLocalidad());
        dto.setNombreCalle(d.getNombreCalle());
        dto.setNumCalle(d.getNumCalle());
        dto.setPais(d.getPais());
        dto.setPiso(d.getPiso());
        dto.setProvincia(d.getProvincia());
        return dto;
    }
}
