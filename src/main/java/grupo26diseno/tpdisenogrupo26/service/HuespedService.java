package grupo26diseno.tpdisenogrupo26.service;

import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.Huesped;


public interface HuespedService {
    Huesped agregarHuesped(Huesped huesped, boolean forzar) throws DocumentoUsadoException;
}
