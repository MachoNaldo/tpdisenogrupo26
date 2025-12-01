package grupo26diseno.tpdisenogrupo26.mapper;

import java.time.LocalDate;
import java.time.Period;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoConsumidor;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import grupo26diseno.tpdisenogrupo26.model.TipoSexo;

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
        h.setFechaNacimiento(dto.getFechaNacimiento());
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
    public HuespedDTO crearDTO(Huesped h) {
    HuespedDTO dto = new HuespedDTO();

    dto.setApellido(h.getApellido());
    dto.setConsumidorFinal(h.getConsumidorFinal().name());
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

    // Dejo comentado ya que en realidad al buscar huespedes no mostramos la direccion, para mostrarla habria que modificar el front y en el mapper de direccion hacer el crearDTO
    //dto.setDireccion(direccionMapper.crearDTO(h.getDireccion()));

    return dto;
}

}
