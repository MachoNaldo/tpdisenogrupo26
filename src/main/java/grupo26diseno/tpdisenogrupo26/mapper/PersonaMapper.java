package grupo26diseno.tpdisenogrupo26.mapper;

import grupo26diseno.tpdisenogrupo26.dtos.PersonaBusquedaDTO;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;
import org.springframework.stereotype.Component;

@Component
public class PersonaMapper {
    public PersonaBusquedaDTO convertirHuespedADTO(Huesped huesped) {
        PersonaBusquedaDTO dto = new PersonaBusquedaDTO();
        dto.setId(huesped.getId());
        dto.setCuit(huesped.getCuit());
        dto.setTipo("HUESPED");
        dto.setNombres(huesped.getNombres());
        dto.setApellido(huesped.getApellido());
        dto.setTelefono(huesped.getTelefono());
        dto.setNacionalidad(huesped.getNacionalidad());
        dto.setDocumentacion(huesped.getDocumentacion());
        return dto;
    }

    public PersonaBusquedaDTO convertirResponsablePagoADTO(ResponsablePago rdp) {
        PersonaBusquedaDTO dto = new PersonaBusquedaDTO();
        dto.setId(rdp.getId());
        dto.setCuit(rdp.getCuit());
        dto.setTipo("RESPONSABLE_PAGO");
        dto.setRazonSocial(rdp.getRazonSocial());
        dto.setTelefono(rdp.getTelefono());
        dto.setNacionalidad(rdp.getNacionalidad());
        return dto;
    }
}
