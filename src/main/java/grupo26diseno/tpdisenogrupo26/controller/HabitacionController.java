package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo26diseno.tpdisenogrupo26.dtos.DisponibilidadDTO;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;

@RestController
@RequestMapping("/api/habitaciones")
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
    
    @GetMapping("/{numero}/existe")
    public ResponseEntity<Boolean> verificarExistencia(@PathVariable Long numero) {
    
    boolean existe = habitacionService.existeNumero(numero);

    return ResponseEntity.ok(existe);
    }

    /*
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
    } */
    /* 
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
    }*/

}

