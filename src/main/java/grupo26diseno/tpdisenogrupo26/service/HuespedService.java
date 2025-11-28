package grupo26diseno.tpdisenogrupo26.service;

import java.util.List;

import DTOs.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import java.util.Optional;

public interface HuespedService {

    Huesped agregarHuesped(HuespedDTO huesped, boolean forzar) throws DocumentoUsadoException;

    public List<Huesped> listarHuespedes();

    public Optional<Huesped> buscarHuespedPorId(Long id);

    List<Huesped> buscarHuespedesPorCriterios(String apellido, String nombres, TipoDoc tipoDocumento, String documentacion);
}
