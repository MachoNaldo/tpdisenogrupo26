package grupo26diseno.tpdisenogrupo26.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import grupo26diseno.tpdisenogrupo26.dtos.ResponsablePagoDTO;
import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;

@Component
public class ResponsablePagoMapper {

    @Autowired
    private DireccionMapper direccionMapper;

    public ResponsablePago crearEntidad(ResponsablePagoDTO dto) {
        ResponsablePago rp = new ResponsablePago();
        rp.setCuit(dto.getCuit());
        rp.setRazonSocial(dto.getRazonSocial());
        rp.setTelefono(dto.getTelefono());
        rp.setNacionalidad(dto.getNacionalidad());

        if (dto.getDireccion() != null) {
            rp.setDireccion(direccionMapper.crearEntidad(dto.getDireccion()));
        }

        return rp;
    }

    public ResponsablePagoDTO crearDTO(ResponsablePago rp) {
        ResponsablePagoDTO dto = new ResponsablePagoDTO();
        dto.setId(rp.getId());
        dto.setCuit(rp.getCuit());
        dto.setRazonSocial(rp.getRazonSocial());
        dto.setTelefono(rp.getTelefono());
        dto.setNacionalidad(rp.getNacionalidad());

        // Igual que Huesped: solo si el front la necesita
        // dto.setDireccion(direccionMapper.crearDTO(rp.getDireccion()));

        return dto;
    }
}
