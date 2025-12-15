package grupo26diseno.tpdisenogrupo26.service;

import java.util.List;
import java.util.Optional;

import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;

public interface HuespedService {
    
    
    Huesped agregarHuesped(HuespedDTO huesped, boolean forzar) throws DocumentoUsadoException;

    
    public Optional<Huesped> buscarHuespedPorId(Long id);

    
    List<HuespedDTO> buscarHuespedesPorCriterios(String apellido, String nombres, TipoDoc tipoDocumento, String documentacion);
    /**
      //Elimina huesped por el id
      @param id 
      @return //0 si se elimino con exito, 1 si no se encontro, 2 si ya estuvo hospedado.
     */
    void eliminarHuesped(Long id);
}