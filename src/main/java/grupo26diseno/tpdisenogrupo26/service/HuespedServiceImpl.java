package grupo26diseno.tpdisenogrupo26.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.repository.HuespedRepository;

@Service
public class HuespedServiceImpl implements HuespedService {

    @Autowired
    private HuespedRepository huespedRepository;

    @Override
    public Huesped agregarHuesped(Huesped huesped, boolean forzar) throws DocumentoUsadoException{
        if(!forzar) {
            Huesped existente = huespedRepository.findByTipoDocumentoAndDocumentacion(huesped.getTipoDocumento(), huesped.getDocumentacion());
            if (existente != null){
                throw new DocumentoUsadoException("El documento"+existente.getTipoDocumento()+" "+ existente.getDocumentacion() + "ya se encuentra registrado para otro huésped.");
            } 
        }
        return huespedRepository.save(huesped);
    }

    @Override
    public List<Huesped> listarHuespedes() {
        return huespedRepository.findAll();
    }

}