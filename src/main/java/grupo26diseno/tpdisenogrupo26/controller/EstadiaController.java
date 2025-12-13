package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo26diseno.tpdisenogrupo26.dtos.EstadiaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Estadia;
import grupo26diseno.tpdisenogrupo26.service.EstadiaService;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;

@RestController
@RequestMapping("/api/estadias")
public class EstadiaController {

    @Autowired
    private HabitacionService habitacionService;  

    @Autowired
    private EstadiaService estadiaService;

    @PostMapping("/ocupar") // Forzar sirve para cuando queremos ocupar una habitacion aunque haya un solapamiento
    public ResponseEntity<?> crear(@RequestBody EstadiaDTO estadiaDTO,  @RequestParam(defaultValue = "false") boolean forzar) {
        try {
            habitacionService.ocuparHabitacion(estadiaDTO, forzar);
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

    @GetMapping("/facturar/buscar")
    public ResponseEntity<Estadia> obtenerDatos(@RequestParam Long habitacion, @RequestParam LocalDate fecha) {
    Estadia estadia = estadiaService.buscarEstadiaCompleta(habitacion, fecha);
    
    if (estadia == null) {
         return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(estadia);
    }
}

