package grupo26diseno.tpdisenogrupo26.mapper;

import org.springframework.stereotype.Component;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.model.TipoHabitacion;

@Component
public class ReservaMapper {

    public ReservaDTO crearDTO(Reserva reserva) {

        ReservaDTO dto = new ReservaDTO();

        
        dto.setCliente(new ReservaDTO.ClienteDTO(
                reserva.getNombreReservador(),
                reserva.getApellidoReservador(),
                reserva.getTelefonoReservador()
        ));


        ReservaDTO.HabitacionReservaDTO habitacion = new ReservaDTO.HabitacionReservaDTO();
        habitacion.setIdReserva(reserva.getId());
        habitacion.setNumeroHabitacion(reserva.getHabitacion().getNumero());
        habitacion.setTipo(formatearTipo(reserva.getHabitacion().getTipo()));
        habitacion.setFechaInicio(reserva.getFechaInicio().toString());
        habitacion.setFechaFin(reserva.getFechaFinal().toString());

        dto.getReservas().add(habitacion);


        return dto;
    }



    private String formatearTipo(TipoHabitacion tipo) {
        if (tipo == null) return "N/D";
        return tipo.name().replaceAll("([a-z])([A-Z])", "$1 $2");
    }
}
