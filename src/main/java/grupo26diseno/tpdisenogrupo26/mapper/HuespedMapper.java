package grupo26diseno.tpdisenogrupo26.mapper;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import DTOs.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoConsumidor;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import grupo26diseno.tpdisenogrupo26.model.TipoSexo;
import grupo26diseno.tpdisenogrupo26.mapper.DireccionMapper;
import DTOs.DireccionDTO;
import java.time.LocalDate;
import java.util.Date;
import java.time.Period;
import java.time.ZoneId;

@Component
public class HuespedMapper {


     @Autowired
    private DireccionMapper direccionMapper;

    public Huesped crearEntidad(HuespedDTO dto) {
        Huesped h = new Huesped();
        h.setApellido(dto.getApellido());
        h.setConsumidorFinal(TipoConsumidor.valueOf(dto.getConsumidorFinal()));
        h.setCuit(dto.getCuit());
        h.setDocumentacion(dto.getDocumentacion());
        h.setEmail(dto.getEmail());
        LocalDate hoy = LocalDate.now();
         if (dto.getFechaNacimiento() != null) {
            h.setFechaNacimiento(
                Date.from(dto.getFechaNacimiento()
                    .atStartOfDay(ZoneId.systemDefault())
                    .toInstant())
            );
        }
        int edad = Period.between(dto.getFechaNacimiento(), hoy).getYears();
        h.setEdad(edad);
        
        h.setNacionalidad(dto.getNacionalidad());
        h.setNombres(dto.getNombres());
        h.setOcupacion(dto.getOcupacion());
        h.setSexo(TipoSexo.valueOf(dto.getSexo()));
        h.setTelefono(dto.getTelefono());
        h.setTipoDocumento(TipoDoc.valueOf(dto.getTipoDocumento()));

        h.setDireccion(direccionMapper.crearEntidad(dto.getDireccion()));

        return h;
    }
}
