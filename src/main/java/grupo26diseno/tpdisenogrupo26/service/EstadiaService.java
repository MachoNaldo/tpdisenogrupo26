package grupo26diseno.tpdisenogrupo26.service;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; 

import grupo26diseno.tpdisenogrupo26.model.Estadia;
import grupo26diseno.tpdisenogrupo26.repository.EstadiaRepository;

@Service 
public class EstadiaService {

    @Autowired 
    private EstadiaRepository estadiaRepository; 

    /**
     * Busca una estadía completa para facturación basada en el número de habitación y la fecha de salida.
     * @param nroHabitacion Número de la habitación que se está liberando.
     * @param fechaSalida Fecha de salida de la estadía.
     * @return La estadía completa con todos sus detalles para facturación.
     */
    public Estadia buscarEstadiaCompleta(Long nroHabitacion, LocalDate fechaSalida) {
        
        return estadiaRepository.buscarParaFacturar(nroHabitacion, fechaSalida);
    }

    
}