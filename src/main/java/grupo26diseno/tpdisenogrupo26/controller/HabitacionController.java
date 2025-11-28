package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import DTOs.EstadiaDTO;



@RestController
@RequestMapping("/api/habitaciones")
public class HabitacionController {
    @Autowired
    private HabitacionService habitacionService;

    @GetMapping("/{id}/disponibilidad")
    public ResponseEntity<Map<LocalDate, TipoEstadoHabitacion>> consultarDisponibilidad(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        
        try {
            Map<LocalDate, TipoEstadoHabitacion> disponibilidad = 
                habitacionService.obtenerEstadosHabitacionEnPeriodo(id, fechaInicio, fechaFin);
            
            return ResponseEntity.ok(disponibilidad);
            
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
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



}
