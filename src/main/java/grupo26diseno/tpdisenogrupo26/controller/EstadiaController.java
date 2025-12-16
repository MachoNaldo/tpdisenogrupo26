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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;


import grupo26diseno.tpdisenogrupo26.dtos.EstadiaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.model.Estadia;
import grupo26diseno.tpdisenogrupo26.service.EstadiaService;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;



@RestController
@RequestMapping("/api/estadias")
@Tag(name = "Gestión de Estadías", description = "Operaciones para registrar ocupación y facturación")
public class EstadiaController {

    @Autowired
    private HabitacionService habitacionService;  

    @Autowired
    private EstadiaService estadiaService;
    


    @Operation(summary = "Registrar Ocupación (Check-in)", description = "Crea la estadía. Usa 'forzar=true' para ignorar solapamiento y ocupar la habitación de igual forma.")
    @ApiResponse(responseCode = "201", description = "Estadía creada exitosamente.")
    @ApiResponse(responseCode = "409", description = "La habitación ya está ocupada.")
    @ApiResponse(responseCode = "400", description = "Datos inválidos.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    @PostMapping("/ocupar") 
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
    
    @Operation(summary = "Buscar estadía para facturar", description = "Busca una estadía activa por habitación y fecha. Si la fecha es anterior al checkout, la ajusta.")
    @ApiResponse(responseCode = "200", description = "Estadía encontrada")
    @ApiResponse(responseCode = "404", description = "No se encontró estadía en esa habitación para esa fecha")
    @GetMapping("/facturar/buscar")
    public ResponseEntity<Estadia> obtenerDatos(
            @RequestParam("habitacion") Long habitacion,
            @RequestParam("fecha") @DateTimeFormat(iso = ISO.DATE) LocalDate fecha) {

        Estadia estadia = estadiaService.buscarEstadiaCompleta(habitacion, fecha);

        if (estadia == null) {
            return ResponseEntity.notFound().build();
        }

        if (fecha.isBefore(estadia.getFechaCheckOut())) {
            estadia.setFechaCheckOut(fecha);
        }

        return ResponseEntity.ok(estadia);
    }



}

