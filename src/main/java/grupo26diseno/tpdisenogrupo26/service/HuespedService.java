package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.List;

import DTOs.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;

public interface HuespedService {
    

    Huesped agregarHuesped(Huesped huesped, boolean forzar) throws DocumentoUsadoException;

    public List<Huesped> listarHuespedes();

    List<Huesped> buscarHuespedesPorCriterios(String apellido, String nombres, TipoDoc tipoDocumento, String documentacion);
    
    List<HuespedDTO> obtenerHuespedesDeSalida(Long numeroHabitacion, LocalDate fecha);
    
}

