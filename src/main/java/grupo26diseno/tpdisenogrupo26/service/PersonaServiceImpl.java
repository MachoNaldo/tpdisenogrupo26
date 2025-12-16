package grupo26diseno.tpdisenogrupo26.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.dtos.PersonaBusquedaDTO;
import grupo26diseno.tpdisenogrupo26.mapper.PersonaMapper;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;
import grupo26diseno.tpdisenogrupo26.repository.HuespedRepository;
import grupo26diseno.tpdisenogrupo26.repository.ResponsablePagoRepository;;

@Service
public class PersonaServiceImpl implements PersonaService{

    @Autowired
    private HuespedRepository huespedRepository;

    @Autowired
    private ResponsablePagoRepository responsablePagoRepository;

    @Autowired
    private PersonaMapper personaMapper;

    public PersonaBusquedaDTO buscarPorCuit(String cuit) {
        String cuitLimpio = cuit.replaceAll("\\D", "");

        // Primero buscar en Responsable de Pago
        Optional<ResponsablePago> rdpOpt = responsablePagoRepository.findByCuit(cuitLimpio);
        if (rdpOpt.isPresent()) {
            return personaMapper.convertirResponsablePagoADTO(rdpOpt.get());
        }

        // Si no se encuentra, buscar en Huésped
        Optional<Huesped> huespedOpt = huespedRepository.findByCuit(cuitLimpio);
        if (huespedOpt.isPresent()) {
            return  personaMapper.convertirHuespedADTO(huespedOpt.get());
        }

        // Si no se encuentra en ninguna tabla
        throw new IllegalArgumentException("No se encontró ninguna persona con CUIT: " + cuit);
    }
}