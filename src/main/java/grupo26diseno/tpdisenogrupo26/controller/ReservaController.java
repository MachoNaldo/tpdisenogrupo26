package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;
import grupo26diseno.tpdisenogrupo26.service.ReservaService;


@RestController
@RequestMapping("/api/reservas")
@Tag(name = "Gestión de Reservas", description = "Creación, búsqueda y cancelación de reservas futuras")
public class ReservaController {

    @Autowired
    private HabitacionService habitacionService;

    @Autowired
    private ReservaService reservaService;

    @Operation(summary = "Crear nueva reserva", description = "Genera una reserva validando disponibilidad.")
    @ApiResponse(responseCode = "201", description = "Reserva creada exitosamente.")
    @ApiResponse(responseCode = "409", description = "La habitación no está disponible en esas fechas.")
    @ApiResponse(responseCode = "400", description = "Datos inválidos.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor.")

    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody ReservaDTO dto) throws DisponibilidadException {
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


    @Operation(summary = "Consultar reservas por habitación", description = "Devuelve las reservas de una habitación específica en un rango de fechas.")
    @ApiResponse(responseCode = "200", description = "Listado obtenido correctamente")

    @GetMapping
    public List<ReservaDTO> obtenerReserva(@RequestParam long numeroHabitacion, @RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin) {
        return reservaService.obtenerReservasPorHabitacionYFecha(numeroHabitacion, fechaInicio, fechaFin);
    }

    @Operation(summary = "Buscar reservas por cliente", description = "Filtra reservas por nombre o apellido del titular.")
    @ApiResponse(responseCode = "200", description = "Búsqueda exitosa")

    @GetMapping("/buscar")
    public List<ReservaDTO> buscarReserva(
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String nombres) {

        return reservaService.buscarReservaPorCriterios(apellido, nombres);
    }

    @Operation(summary = "Cancelar reserva", description = "Elimina la reserva del sistema.")
    @ApiResponse(responseCode = "204", description = "Reserva cancelada.")
    @ApiResponse(responseCode = "404", description = "ID de reserva no encontrado.")

    @DeleteMapping("/{id}") 
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        reservaService.cancelarReserva(id);
        return ResponseEntity.noContent().build();
    }


    
    

}
