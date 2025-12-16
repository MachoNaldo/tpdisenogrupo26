package grupo26diseno.tpdisenogrupo26.service;

import java.util.List;
import java.util.Optional;

import grupo26diseno.tpdisenogrupo26.dtos.ActualizarCuitCondicionFiscalDTO;
import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;



public interface HuespedService {

    Huesped agregarHuesped(HuespedDTO huesped, boolean forzar) throws DocumentoUsadoException;

    
    HuespedDTO obtenerPorId(Long id);

    boolean existeDocumento(TipoDoc tipoDocumento, String documentacion);


    //Modificar
    HuespedDTO actualizarHuesped(Long id, HuespedDTO dto) throws DocumentoUsadoException;

    Optional<Huesped> buscarHuespedPorId(Long id);

    List<HuespedDTO> buscarHuespedesPorCriterios(String apellido, String nombres, TipoDoc tipoDocumento, String documentacion);

    /**
      Elimina huésped por el id
      @param id
     */
    void eliminarHuesped(Long id);

    void actualizarCuitCondicionFiscal(Long huespedId, ActualizarCuitCondicionFiscalDTO dto);

    HuespedDTO buscarPorCuit(String cuit);
}
