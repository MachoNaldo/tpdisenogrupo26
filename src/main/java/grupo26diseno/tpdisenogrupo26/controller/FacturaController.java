package grupo26diseno.tpdisenogrupo26.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import grupo26diseno.tpdisenogrupo26.service.FacturaService;
import grupo26diseno.tpdisenogrupo26.dtos.*;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    @Autowired
    private  FacturaService facturaService;
    
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
    
    @GetMapping("/{id}")
    public ResponseEntity<FacturaDTO> obtenerFactura(@PathVariable Long id) {
        FacturaDTO facturaDTO = facturaService.obtenerFactura(id);
        return ResponseEntity.ok(facturaDTO);
    }
}