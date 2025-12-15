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

    public Estadia buscarEstadiaCompleta(Long nroHabitacion, LocalDate fechaSalida) {
        
        return estadiaRepository.buscarParaFacturar(nroHabitacion, fechaSalida);
    }

    
}