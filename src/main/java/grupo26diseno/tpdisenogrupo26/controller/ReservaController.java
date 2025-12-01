package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;
import grupo26diseno.tpdisenogrupo26.service.ReservaService;


@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private HabitacionService habitacionService;

    @Autowired
    private ReservaService reservaService;

    @PostMapping
    public void crearReserva(@RequestBody ReservaDTO dto) throws DisponibilidadException {
        System.out.println(">>> RESERVA RECIBIDA EN BACKEND");
        habitacionService.crearReserva(dto);
    }

    @GetMapping
    public List<ReservaDTO> getMethodName(@RequestParam long numeroHabitacion, @RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin) {
        return reservaService.obtenerReservasPorHabitacionYFecha(numeroHabitacion, fechaInicio, fechaFin);
    }
    
    

}
