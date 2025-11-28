package grupo26diseno.tpdisenogrupo26.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.service.ReservaService;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping
    public void crearReserva(@RequestBody ReservaDTO dto) throws DisponibilidadException {
        System.out.println(">>> RESERVA RECIBIDA EN BACKEND");
        reservaService.crearReserva(dto);
    }
    

}
