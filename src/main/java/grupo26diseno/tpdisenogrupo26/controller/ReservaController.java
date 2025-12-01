package grupo26diseno.tpdisenogrupo26.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;

import grupo26diseno.tpdisenogrupo26.service.HabitacionService;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private HabitacionService habitacionService;

    @PostMapping
    public void crearReserva(@RequestBody ReservaDTO dto) throws DisponibilidadException {
        System.out.println(">>> RESERVA RECIBIDA EN BACKEND");
        habitacionService.crearReserva(dto);
    }
    

}
