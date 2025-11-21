package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

import grupo26diseno.tpdisenogrupo26.model.TipoEstadoHabitacion;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;



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


}
