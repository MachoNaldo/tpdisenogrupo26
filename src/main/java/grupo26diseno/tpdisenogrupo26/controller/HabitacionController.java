package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import grupo26diseno.tpdisenogrupo26.dtos.DisponibilidadDTO;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import DTOs.EstadiaDTO;

@RestController
@RequestMapping("/api/habitaciones")
@CrossOrigin(origins = "*")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    @GetMapping("/disponibilidad")
    public List<DisponibilidadDTO> disponibilidad(
        @RequestParam String desde,
        @RequestParam String hasta
    ) {
        LocalDate f1 = LocalDate.parse(desde);
        LocalDate f2 = LocalDate.parse(hasta);

        return habitacionService.obtenerDisponibilidad(f1, f2);
    }
    @PostMapping("/ocupar")
    public ResponseEntity<?> crearEstadia(@RequestBody EstadiaDTO estadiaDTO) {
        try {
            habitacionService.agregarEstadia(estadiaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(estadiaDTO);
        } catch (DisponibilidadException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear la ocupación: " + e.getMessage());
        }
    }

    @PostMapping("/reservar")
    public String reservar(
            @RequestParam Long numero,
            @RequestParam String desde,
            @RequestParam String hasta
    ) {
        LocalDate f1 = LocalDate.parse(desde);
        LocalDate f2 = LocalDate.parse(hasta);

        habitacionService.reservarHabitacion(numero, f1, f2);
        
        return "OK";
    }

}

