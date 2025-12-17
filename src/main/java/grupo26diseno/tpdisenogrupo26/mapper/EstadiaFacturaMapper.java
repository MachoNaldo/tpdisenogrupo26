package grupo26diseno.tpdisenogrupo26.mapper;

import org.springframework.stereotype.Component;
import grupo26diseno.tpdisenogrupo26.dtos.EstadiaFacturaDTO;
import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.model.Estadia;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EstadiaFacturaMapper {

    private final HuespedMapper huespedMapper;

    public EstadiaFacturaMapper(HuespedMapper huespedMapper) {
        this.huespedMapper = huespedMapper;
    }

    public EstadiaFacturaDTO toDTO(Estadia estadia) {
        if (estadia == null) {
            return null;
        }

        // Calcular cantidad de noches
        long noches = ChronoUnit.DAYS.between(
                estadia.getFechaCheckIn(),
                estadia.getFechaCheckOut());

        // Calcular precio total
        double precioPorNoche = estadia.getHabitacion().getTipo().getPrecioBase();
        double precioTotal = noches * precioPorNoche;

        // Mapear habitación
        EstadiaFacturaDTO.HabitacionFacturaDTO habitacionDTO = mapearHabitacion(estadia);

        HuespedDTO huespedPrincipalDTO = huespedMapper.crearDTO(estadia.getHuespedPrincipal());

        // Mapear acompañantes
        List<HuespedDTO> acompanantesDTO = estadia.getAcompanantes().stream()
                .map(huespedMapper::crearDTO)
                .collect(Collectors.toList());

        EstadiaFacturaDTO dto = new EstadiaFacturaDTO();
        dto.setId(estadia.getId());
        dto.setFechaCheckIn(estadia.getFechaCheckIn().toString());
        dto.setFechaCheckOut(estadia.getFechaCheckOut().toString());
        dto.setCantidadNoches((int) noches);
        dto.setPrecioTotal(precioTotal);
        dto.setHabitacion(habitacionDTO);
        dto.setHuespedPrincipal(huespedPrincipalDTO);
        dto.setAcompanantes(acompanantesDTO);

        return dto;
    }

    private EstadiaFacturaDTO.HabitacionFacturaDTO mapearHabitacion(Estadia estadia) {
        EstadiaFacturaDTO.HabitacionFacturaDTO habitacionDTO = new EstadiaFacturaDTO.HabitacionFacturaDTO();

        habitacionDTO.setNumero(estadia.getHabitacion().getNumero());
        habitacionDTO.setTipo(estadia.getHabitacion().getTipo().toString());
        habitacionDTO.setPrecioPorNoche(estadia.getHabitacion().getTipo().getPrecioBase());

        return habitacionDTO;
    }
}