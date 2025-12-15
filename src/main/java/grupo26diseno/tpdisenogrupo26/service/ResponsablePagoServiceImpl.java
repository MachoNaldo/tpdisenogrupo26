package grupo26diseno.tpdisenogrupo26.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.dtos.DireccionDTO;
import grupo26diseno.tpdisenogrupo26.dtos.ResponsablePagoDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.mapper.ResponsablePagoMapper;
import grupo26diseno.tpdisenogrupo26.model.Direccion;
import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;
import grupo26diseno.tpdisenogrupo26.repository.DireccionRepository;
import grupo26diseno.tpdisenogrupo26.repository.ResponsablePagoRepository;
import jakarta.transaction.Transactional;

@Service
public class ResponsablePagoServiceImpl implements ResponsablePagoService {

    @Autowired
    private ResponsablePagoRepository responsablePagoRepository;

    @Autowired
    private DireccionRepository direccionRepository;

    @Autowired
    private ResponsablePagoMapper responsablePagoMapper;

    @Override
    @Transactional
    public ResponsablePago crearResponsablePago(ResponsablePagoDTO dto, boolean forzar)
            throws DocumentoUsadoException {

        if (!forzar) {
            boolean existe = responsablePagoRepository.existsByCuit(dto.getCuit());
            if (existe) {
                throw new DocumentoUsadoException(
                        "El CUIT " + dto.getCuit() + " ya se encuentra registrado para otro Responsable de Pago.");
            }
        }

        DireccionDTO direccionDTO = dto.getDireccion();
        ResponsablePago nuevo = responsablePagoMapper.crearEntidad(dto);

        if (direccionDTO != null) {
            Optional<Direccion> direccionExistente =
                    direccionRepository.findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
                            direccionDTO.getNombreCalle(),
                            direccionDTO.getNumCalle(),
                            direccionDTO.getLocalidad(),
                            direccionDTO.getCodPostal(),
                            direccionDTO.getProvincia(),
                            direccionDTO.getPais());

            if (direccionExistente.isPresent()) {
                nuevo.setDireccion(direccionExistente.get());
            }
        }

        return responsablePagoRepository.save(nuevo);
    }

    @Override
    public Optional<ResponsablePago> buscarResponsablePagoPorId(Long id) {
        return responsablePagoRepository.findById(id);
    }

    @Override
    public Optional<ResponsablePago> buscarResponsablePagoPorCuit(String cuit) {
        return responsablePagoRepository.findByCuit(cuit);
    }
}
