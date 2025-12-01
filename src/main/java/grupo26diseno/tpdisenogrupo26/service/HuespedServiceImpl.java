package grupo26diseno.tpdisenogrupo26.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.dtos.DireccionDTO;
import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.mapper.HuespedMapper;
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

    @Autowired
    private HuespedMapper huespedMapper;

    @Override
    @Transactional
    public Huesped agregarHuesped(HuespedDTO huesped, boolean forzar) throws DocumentoUsadoException {
        if (!forzar) {
            Huesped existente = huespedRepository.findByTipoDocumentoAndDocumentacion(
                    TipoDoc.valueOf(huesped.getTipoDocumento()), huesped.getDocumentacion());
            if (existente != null) {
                throw new DocumentoUsadoException("El documento" + existente.getTipoDocumento() + " "
                        + existente.getDocumentacion() + "ya se encuentra registrado para otro huésped.");
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

    @Override // Va a HuespedDTO
    public List<Huesped> listarHuespedes() {
        return huespedRepository.findAll();
    }

    @Override
    public List<Huesped> buscarHuespedesPorCriterios(String apellido, String nombres, TipoDoc tipoDocumento,
            String documentacion) {
        return huespedRepository.buscarPorCriterios(apellido, nombres, tipoDocumento, documentacion);
    }

    @Override
    public Optional<Huesped> buscarHuespedPorId(Long id) {
        return huespedRepository.findById(id);
    }
}
