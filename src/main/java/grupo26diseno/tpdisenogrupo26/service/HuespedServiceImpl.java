package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import DTOs.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.Direccion;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import grupo26diseno.tpdisenogrupo26.repository.DireccionRepository;
import grupo26diseno.tpdisenogrupo26.repository.HuespedRepository;
import jakarta.transaction.Transactional;

@Service
public class HuespedServiceImpl implements HuespedService {

    @Autowired
    private HuespedRepository huespedRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @Override
    @Transactional
    public Huesped agregarHuesped(Huesped huesped, boolean forzar) throws DocumentoUsadoException {
        if (!forzar) {
            Huesped existente = huespedRepository.findByTipoDocumentoAndDocumentacion(huesped.getTipoDocumento(), huesped.getDocumentacion());
            if (existente != null) {
                throw new DocumentoUsadoException("El documento" + existente.getTipoDocumento() + " " + existente.getDocumentacion() + "ya se encuentra registrado para otro huésped.");
            }
        }
        Direccion direccion = huesped.getDireccion();
        if (direccion != null) {
            Optional<Direccion> direccionExistente = direccionRepository
                    .findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
                            direccion.getNombreCalle(),
                            direccion.getNumCalle(),
                            direccion.getLocalidad(),
                            direccion.getCodPostal(),
                            direccion.getProvincia(),
                            direccion.getPais()
                    );

            if (direccionExistente.isPresent()) {
                huesped.setDireccion(direccionExistente.get());
            } 
        }
        return huespedRepository.save(huesped);
    }

    @Override
    public List<Huesped> listarHuespedes() {
        return huespedRepository.findAll();
    }

     @Override
    public List<Huesped> buscarHuespedesPorCriterios(String apellido, String nombres, TipoDoc tipoDocumento, String documentacion) {
        return huespedRepository.buscarPorCriterios(apellido, nombres, tipoDocumento, documentacion);
    }
    
    @Override
    public List<HuespedDTO> obtenerHuespedesDeSalida(Long numero, LocalDate fecha) {
        
        
        List<Huesped> entidades = huespedRepository.buscarPorSalida(numero, fecha);
        List<HuespedDTO> dtos = new ArrayList<>();
        
        
        for (Huesped h : entidades) {
            
            HuespedDTO dto = new HuespedDTO();
            
           
            dto.setNombres(h.getNombres());
            dto.setApellido(h.getApellido());
            dto.setDocumentacion(h.getDocumentacion());        
            dtos.add(dto);
        }

        return dtos; 
    }
}


