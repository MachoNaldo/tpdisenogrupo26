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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import grupo26diseno.tpdisenogrupo26.dtos.DisponibilidadDTO;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;

@RestController
@RequestMapping("/api/habitaciones")
@Tag(name = "Gestión de Habitaciones", description = "Consultas de disponibilidad y listado de habitaciones")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    @Operation(summary = "Consultar disponibilidad por fechas", description = "Devuelve qué habitaciones están libres u ocupadas en un rango.")
    @ApiResponse(responseCode = "200", description = "Lista devuelta correctamente.")
    @ApiResponse(responseCode = "400", description = "Formato de fecha inválido.")

    @GetMapping("/disponibilidad")
    public List<DisponibilidadDTO> disponibilidad(
        @RequestParam String desde,
        @RequestParam String hasta
    ) {
        LocalDate f1 = LocalDate.parse(desde);
        LocalDate f2 = LocalDate.parse(hasta);

        return habitacionService.obtenerDisponibilidad(f1, f2);
    }
    
    @Operation(summary = "Verificar existencia de habitación", description = "Devuelve true si el número de habitación existe en la base de datos.")
    @ApiResponse(responseCode = "200", description = "Consulta exitosa")

    @GetMapping("/{numero}/existe")
    public ResponseEntity<Boolean> verificarExistencia(@PathVariable Long numero) {
    
    boolean existe = habitacionService.existeNumero(numero);

    return ResponseEntity.ok(existe);
    }
    
    @Operation(summary = "Listar todas las habitaciones", description = "Devuelve una lista con los números de todas las habitaciones registradas.")
    @ApiResponse(responseCode = "200", description = "Operación exitosa")

    @GetMapping
    public ResponseEntity<List<Long>> obtenerTodas() {
        List<Long> habitaciones = habitacionService.listarNumeros();
        return ResponseEntity.ok(habitaciones);
    }

}

