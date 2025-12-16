package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.dtos.ActualizarCuitCondicionFiscalDTO;
import grupo26diseno.tpdisenogrupo26.dtos.DireccionDTO;
import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.excepciones.HuespedYaHospedadoException;
import grupo26diseno.tpdisenogrupo26.mapper.DireccionMapper;
import grupo26diseno.tpdisenogrupo26.mapper.HuespedMapper;
import grupo26diseno.tpdisenogrupo26.model.CondicionFiscal;
import grupo26diseno.tpdisenogrupo26.model.Direccion;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import grupo26diseno.tpdisenogrupo26.model.TipoSexo;
import grupo26diseno.tpdisenogrupo26.repository.DireccionRepository;
import grupo26diseno.tpdisenogrupo26.repository.EstadiaRepository;
import grupo26diseno.tpdisenogrupo26.repository.HuespedRepository;
import jakarta.persistence.EntityNotFoundException;
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



    @Autowired
    private DireccionMapper direccionMapper;

    @Override
    @Transactional
    public Huesped agregarHuesped(HuespedDTO huesped, boolean forzar) throws DocumentoUsadoException {
        if (!forzar) {
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
        List<HuespedDTO> listaHuespedDTOs = huespedRepository
                .buscarPorCriterios(apellido, nombres, tipoDocumento, documentacion).stream()
                .map(huesped -> huespedMapper.crearDTO(huesped))
                .toList();
        return listaHuespedDTOs;
    }

    @Override
    public Optional<Huesped> buscarHuespedPorId(Long id) {
        return huespedRepository.findById(id);
    }

    
    @Override
    public HuespedDTO obtenerPorId(Long id) {
        Huesped h = huespedRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El huésped con id " + id + " no existe."));

        
        HuespedDTO dto = huespedMapper.crearDTO(h);

       
        if (h.getDireccion() != null) {
            DireccionDTO dirDto = direccionMapper.crearDTO(h.getDireccion());
            dto.setDireccion(dirDto);
        }

        return dto;
    }

    @Override
    @Transactional
    public HuespedDTO actualizarHuesped(Long id, HuespedDTO dto) throws DocumentoUsadoException {
        Huesped existente = huespedRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("El huésped con id " + id + " no existe."));


        String docNuevo = dto.getDocumentacion() != null ? dto.getDocumentacion().trim() : null;

        if (docNuevo != null) docNuevo = docNuevo.replaceAll("\\D", "");

        TipoDoc tipoNuevo = dto.getTipoDocumento() != null ? TipoDoc.valueOf(dto.getTipoDocumento()) : null;


        String docActual = existente.getDocumentacion() != null ? existente.getDocumentacion().trim() : null;
        if (docActual != null) docActual = docActual.replaceAll("\\D", "");

        TipoDoc tipoActual = existente.getTipoDocumento();

        boolean mismoDocumento =
                tipoNuevo != null && tipoActual != null
                && tipoNuevo.equals(tipoActual)
                && docNuevo != null && docActual != null
                && docNuevo.equals(docActual);


        if (!mismoDocumento) {
            List<Huesped> conMismoDoc = huespedRepository.findByTipoDocumentoAndDocumentacion(tipoNuevo, docNuevo);

            boolean existeOtro = conMismoDoc.stream().anyMatch(h -> !h.getId().equals(id));
            if (existeOtro) {
                Huesped otro = conMismoDoc.stream().filter(h -> !h.getId().equals(id)).findFirst().orElse(null);
                throw new DocumentoUsadoException("El documento "
                        + (otro != null ? otro.getTipoDocumento() : tipoNuevo) + " "
                        + (otro != null ? otro.getDocumentacion() : docNuevo)
                        + " ya se encuentra registrado para otro huésped.");
            }
        }

        existente.setApellido(dto.getApellido());
        existente.setNombres(dto.getNombres());
        existente.setEmail(dto.getEmail());


        existente.setDocumentacion(docNuevo);
        existente.setTipoDocumento(tipoNuevo);

        existente.setTelefono(dto.getTelefono());
        existente.setCuit(dto.getCuit());
        existente.setNacionalidad(dto.getNacionalidad());
        existente.setOcupacion(dto.getOcupacion());

        existente.setCondicionFiscal(CondicionFiscal.valueOf(dto.getCondicionFiscal()));
        existente.setSexo(TipoSexo.valueOf(dto.getSexo()));

        existente.setFechaNacimiento(dto.getFechaNacimiento());
        if (dto.getFechaNacimiento() != null) {
            int edad = Period.between(dto.getFechaNacimiento(), LocalDate.now()).getYears();
            existente.setEdad(edad);
        }

        DireccionDTO direccionDto = dto.getDireccion();
        if (direccionDto != null) {
            Optional<Direccion> direccionExistente = direccionRepository
                    .findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
                            direccionDto.getNombreCalle(),
                            direccionDto.getNumCalle(),
                            direccionDto.getLocalidad(),
                            direccionDto.getCodPostal(),
                            direccionDto.getProvincia(),
                            direccionDto.getPais());

            if (direccionExistente.isPresent()) {
                existente.setDireccion(direccionExistente.get());
            } else {
                Direccion nueva = direccionMapper.crearEntidad(direccionDto);
                Direccion guardada = direccionRepository.save(nueva);
                existente.setDireccion(guardada);
            }
        }

        Huesped guardado = huespedRepository.save(existente);

        
        HuespedDTO out = huespedMapper.crearDTO(guardado);
        if (guardado.getDireccion() != null) {
            out.setDireccion(direccionMapper.crearDTO(guardado.getDireccion()));
        }
        return out;
    }


    @Override
    @Transactional
    public void eliminarHuesped(Long id) {
        if (!huespedRepository.existsById(id)) {
            throw new RuntimeException("El huésped con id " + id + " no existe.");
        }

        boolean tieneEstadias = estadiaRepository.existeHuespedEnEstadias(id);

        if (tieneEstadias) {
            throw new HuespedYaHospedadoException("El huesped ya estuvo hospedado por lo que no se puede eliminar");
        }

        huespedRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void actualizarCuitCondicionFiscal(Long huespedId, ActualizarCuitCondicionFiscalDTO dto) {
        Huesped huesped = huespedRepository.findById(huespedId)
                .orElseThrow(() -> new IllegalArgumentException("Huésped no encontrado con ID: " + huespedId));

        if (dto.getCuit() == null || dto.getCuit().trim().isEmpty()) {
            throw new IllegalArgumentException("El CUIT no puede estar vacío");
        }

        String cuitLimpio = dto.getCuit().replaceAll("\\D", "");

        if (cuitLimpio.length() != 11) {
            throw new IllegalArgumentException("El CUIT debe tener exactamente 11 dígitos");
        }

        if (dto.getCondicionFiscal() == null) {
            throw new IllegalArgumentException("La condición fiscal no puede estar vacía");
        }

        huesped.setCuit(cuitLimpio);
        huesped.setCondicionFiscal(dto.getCondicionFiscal());

        huespedRepository.save(huesped);
    }

    @Override
    public HuespedDTO buscarPorCuit(String cuit) {
        String cuitLimpio = cuit.replaceAll("\\D", "");
        Huesped huesped = huespedRepository.findByCuit(cuitLimpio)
                .orElseThrow(() -> new IllegalArgumentException("Huésped no encontrado con CUIT: " + cuit));

        return huespedMapper.crearDTO(huesped);
    }

    @Override
    public boolean existeDocumento(TipoDoc tipoDocumento, String documentacion) {
        if (tipoDocumento == null || documentacion == null) return false;

        String docLimpio = documentacion.trim().replaceAll("\\D", "");
        if (docLimpio.isEmpty()) return false;

        return huespedRepository.existsByTipoDocumentoAndDocumentacion(tipoDocumento, docLimpio);
    }

}
