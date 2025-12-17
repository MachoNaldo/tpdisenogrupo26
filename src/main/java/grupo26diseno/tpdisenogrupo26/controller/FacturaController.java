package grupo26diseno.tpdisenogrupo26.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import grupo26diseno.tpdisenogrupo26.service.FacturaService;
import grupo26diseno.tpdisenogrupo26.dtos.*;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/facturas")
@Tag(name = "Gestión de Facturas", description = "Creación y consulta de comprobantes de pago")
public class FacturaController {

    @Autowired
    private  FacturaService facturaService;
    
    @Operation(summary = "Generar nueva factura", description = "Crea una factura para una estadía finalizada o servicios.")
    @ApiResponse(responseCode = "201", description = "Factura generada exitosamente.")
    @ApiResponse(responseCode = "400", description = "Datos inválidos o error de negocio.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    @PostMapping("/crear")
    public ResponseEntity<FacturaDTO> crearFactura(@RequestBody CrearFacturaRequest request) {
        try {
            FacturaDTO facturaDTO = facturaService.crearFactura(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(facturaDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @Operation(summary = "Obtener factura por ID", description = "Busca el detalle completo de una factura emitida.")
    @ApiResponse(responseCode = "200", description = "Factura encontrada.")
    @ApiResponse(responseCode = "404", description = "Factura no encontrada.")

    @GetMapping("/{id}")
    public ResponseEntity<FacturaDTO> obtenerFactura(@PathVariable Long id) {
        FacturaDTO facturaDTO = facturaService.obtenerFactura(id);
        return ResponseEntity.ok(facturaDTO);
    }
}