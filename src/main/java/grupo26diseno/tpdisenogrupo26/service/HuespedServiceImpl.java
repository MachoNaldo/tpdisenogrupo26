package grupo26diseno.tpdisenogrupo26.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.dtos.DireccionDTO;
import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.excepciones.HuespedYaHospedadoException;
import grupo26diseno.tpdisenogrupo26.mapper.HuespedMapper;
import grupo26diseno.tpdisenogrupo26.model.Direccion;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import grupo26diseno.tpdisenogrupo26.repository.DireccionRepository;
import grupo26diseno.tpdisenogrupo26.repository.EstadiaRepository;
import grupo26diseno.tpdisenogrupo26.repository.HuespedRepository;
import jakarta.transaction.Transactional;

@Service
public class HuespedServiceImpl implements HuespedService {

    @Autowired
    private HuespedRepository huespedRepository;

    @Autowired
    private EstadiaRepository estadiaRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private HuespedMapper huespedMapper;
    
    @Override
    @Transactional
    public Huesped agregarHuesped(HuespedDTO huesped, boolean forzar) throws DocumentoUsadoException {
        if (!forzar) { // Si no se fuerza la creación, verificamos si el documento ya está en uso para notificar al usuario
            List<Huesped> existente = huespedRepository.findByTipoDocumentoAndDocumentacion(
                        TipoDoc.valueOf(huesped.getTipoDocumento()), huesped.getDocumentacion());
            if (!existente.isEmpty()) {
                throw new DocumentoUsadoException("El documento " + existente.get(0).getTipoDocumento() + " "
                            + existente.get(0).getDocumentacion() + " ya se encuentra registrado para otro huésped.");
            }
        }
        DireccionDTO direccion = huesped.getDireccion();
        Huesped nuevoHuesped = huespedMapper.crearEntidad(huesped);
        if (direccion != null) {
            Optional<Direccion> direccionExistente = direccionRepository
                        .findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
                                direccion.getNombreCalle(),
                                direccion.getNumCalle(),
                                direccion.getLocalidad(),
                                direccion.getCodPostal(),
                                direccion.getProvincia(),
                                direccion.getPais());

            if (direccionExistente.isPresent()) {
                nuevoHuesped.setDireccion(direccionExistente.get());
            }
        }
        return huespedRepository.save(nuevoHuesped);
    }


    @Override
    public List<HuespedDTO> buscarHuespedesPorCriterios(String apellido, String nombres, TipoDoc tipoDocumento,
            String documentacion) {
                List<HuespedDTO> listaHuespedDTOs = huespedRepository.buscarPorCriterios(apellido, nombres, tipoDocumento, documentacion).stream()
                        .map(huesped -> huespedMapper.crearDTO(huesped))
                        .toList();
                return listaHuespedDTOs;
    }

    @Override
    public Optional<Huesped> buscarHuespedPorId(Long id) {
        return huespedRepository.findById(id);
    }
    
    @Override
    @Transactional
    public void eliminarHuesped(Long id) {
        if (!huespedRepository.existsById(id)) {
             throw new RuntimeException("El huésped con id " + id + " no existe.");
        }

        // Verificamos si el huésped ha estado hospedado en alguna estadía
        boolean tieneEstadias = estadiaRepository.existeHuespedEnEstadias(id);

        if (tieneEstadias) {
            throw new HuespedYaHospedadoException("El huesped ya estuvo hospedado por lo que no se puede eliminar");
        }
        
        // Si pasó los filtros, eliminamos
        huespedRepository.deleteById(id);
    }
}