package grupo26diseno.tpdisenogrupo26.mapper;


import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.stereotype.Component;

import grupo26diseno.tpdisenogrupo26.dtos.FacturaDTO;
import grupo26diseno.tpdisenogrupo26.model.*;

@Component
public class FacturaMapper {
    
    public FacturaDTO crearDTO(Factura factura) {
        if (factura == null) {
            return null;
        }
        
        FacturaDTO dto = new FacturaDTO();
        dto.setId(factura.getId());
        dto.setNumero(factura.getNumero());
        dto.setImporteTotal((double) factura.getImporteTotal());
        dto.setEstado(factura.getEstado().toString());
        dto.setFechaConfeccion(factura.getFechaConfeccion());
        dto.setImporteNeto((double) factura.getImporteNeto());
        dto.setIva((double) factura.getIva());
        dto.setTipoFactura(factura.getTipo());
        
        // Mapear responsable (puede ser Huesped o ResponsablePago)
        if (factura.getResponsable() != null) {
            Persona persona = factura.getResponsable();
            FacturaDTO.ResponsablePagoSimpleDTO responsableDTO = new FacturaDTO.ResponsablePagoSimpleDTO();
            responsableDTO.setId(persona.getId());
            responsableDTO.setCuit(persona.getCuit());
            
            // Obtener razón social según el tipo
            if (persona instanceof ResponsablePago) {
                ResponsablePago rp = (ResponsablePago) persona;
                responsableDTO.setRazonSocial(rp.getRazonSocial());
            } else if (persona instanceof Huesped) {
                Huesped h = (Huesped) persona;
                responsableDTO.setRazonSocial(h.getApellido() + " " + h.getNombres());
            }
            
            dto.setResponsablePago(responsableDTO);
        }
        
        if (factura.getEstadia() != null) {
            Estadia estadia = factura.getEstadia();
            FacturaDTO.EstadiaSimpleDTO estadiaDTO = new FacturaDTO.EstadiaSimpleDTO();
            estadiaDTO.setId(estadia.getId());
            estadiaDTO.setNumeroHabitacion(estadia.getHabitacion().getNumero());
            estadiaDTO.setFechaCheckIn(estadia.getFechaCheckIn());
            estadiaDTO.setFechaCheckOut(estadia.getFechaCheckOut());
            dto.setEstadia(estadiaDTO);
        }
        
        dto.setDetalles(new ArrayList<>());
        
        return dto;
    }
}