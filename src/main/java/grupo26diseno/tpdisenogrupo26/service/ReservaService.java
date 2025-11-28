package grupo26diseno.tpdisenogrupo26.service;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;

public interface ReservaService {
    void crearReserva(ReservaDTO reserva) throws DisponibilidadException;
}
