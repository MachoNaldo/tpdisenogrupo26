package grupo26diseno.tpdisenogrupo26.mapper;

import java.time.LocalDate;
import java.time.Period;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.model.CondicionFiscal;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import grupo26diseno.tpdisenogrupo26.model.TipoSexo;

@Component
public class HuespedMapper {

    @Autowired
    private DireccionMapper direccionMapper;

    public Huesped crearEntidad(HuespedDTO dto) {
        Huesped h = new Huesped();

        h.setApellido(dto.getApellido());
        h.setCondicionFiscal(CondicionFiscal.valueOf(dto.getCondicionFiscal()));
        h.setCuit(dto.getCuit());
        h.setDocumentacion(dto.getDocumentacion());
        h.setEmail(dto.getEmail());

        h.setFechaNacimiento(dto.getFechaNacimiento());
        if (dto.getFechaNacimiento() != null) {
            LocalDate hoy = LocalDate.now();
            int edad = Period.between(dto.getFechaNacimiento(), hoy).getYears();
            h.setEdad(edad);
        }

        h.setNacionalidad(dto.getNacionalidad());
        h.setNombres(dto.getNombres());
        h.setOcupacion(dto.getOcupacion());
        h.setSexo(TipoSexo.valueOf(dto.getSexo()));
        h.setTelefono(dto.getTelefono());
        h.setTipoDocumento(TipoDoc.valueOf(dto.getTipoDocumento()));

        if (dto.getDireccion() != null) {
            h.setDireccion(direccionMapper.crearEntidad(dto.getDireccion()));
        }

        return h;
    }

    
    public HuespedDTO crearDTO(Huesped h) {
        HuespedDTO dto = new HuespedDTO();
        dto.setId(h.getId());
        dto.setApellido(h.getApellido());
        dto.setCondicionFiscal(h.getCondicionFiscal().name());
        dto.setCuit(h.getCuit());
        dto.setDocumentacion(h.getDocumentacion());
        dto.setEmail(h.getEmail());
        dto.setFechaNacimiento(h.getFechaNacimiento());
        dto.setEdad(h.getEdad());
        dto.setNacionalidad(h.getNacionalidad());
        dto.setNombres(h.getNombres());
        dto.setOcupacion(h.getOcupacion());
        dto.setSexo(h.getSexo().name());
        dto.setTelefono(h.getTelefono());
        dto.setTipoDocumento(h.getTipoDocumento().name());
        return dto;
    }

    public HuespedDTO crearDTOCompleto(Huesped h) {
        HuespedDTO dto = crearDTO(h);
        if (h.getDireccion() != null) {
            dto.setDireccion(direccionMapper.crearDTO(h.getDireccion()));
        }
        return dto;
    }
}
