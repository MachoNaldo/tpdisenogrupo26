package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;
import DTOs.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;


public interface ReservaService {
    void crearReserva(ReservaDTO reserva) throws DisponibilidadException;
}
