package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> crearReserva(@RequestBody ReservaDTO dto) throws DisponibilidadException {
        //System.out.println(">>> RESERVA RECIBIDA EN BACKEND");
        try {
        habitacionService.crearReserva(dto);
         return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (DisponibilidadException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la ocupación: " + e.getMessage());
        }
    }


    @GetMapping
    public List<ReservaDTO> obtenerReserva(@RequestParam long numeroHabitacion, @RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin) {
        return reservaService.obtenerReservasPorHabitacionYFecha(numeroHabitacion, fechaInicio, fechaFin);
    }
    
    

}
