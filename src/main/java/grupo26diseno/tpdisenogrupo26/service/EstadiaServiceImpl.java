package grupo26diseno.tpdisenogrupo26.service;


import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; 

import grupo26diseno.tpdisenogrupo26.dtos.EstadiaFacturaDTO;
import grupo26diseno.tpdisenogrupo26.model.Estadia;
import grupo26diseno.tpdisenogrupo26.repository.EstadiaRepository;
import org.springframework.transaction.annotation.Transactional;
import grupo26diseno.tpdisenogrupo26.mapper.EstadiaFacturaMapper;


@Service 
public class EstadiaServiceImpl implements EstadiaService{

    @Autowired 
    private EstadiaRepository estadiaRepository; 

    @Autowired
    private EstadiaFacturaMapper estadiaFacturaMapper;

    @Override
    @Transactional(readOnly = true)
    public EstadiaFacturaDTO obtenerEstadiaParaFacturar(
            Long numeroHabitacion, 
            LocalDate fechaSalida) {
        
        // Buscar la estadía
        Estadia estadia = estadiaRepository
            .buscarParaFacturar(numeroHabitacion, fechaSalida)
            ;
        
        // Usar el mapper para convertir a DTO (calcula automáticamente precios y noches)
        return estadiaFacturaMapper.toDTO(estadia);
    }
    
}