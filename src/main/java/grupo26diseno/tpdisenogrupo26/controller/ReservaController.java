package grupo26diseno.tpdisenogrupo26.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo26diseno.tpdisenogrupo26.excepciones.DisponibilidadException;
import grupo26diseno.tpdisenogrupo26.service.ReservaService;
import DTOs.ReservaDTO;


@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping("/reservar")
    public ResponseEntity<?> crearReserva(
            @RequestBody ReservaDTO reservaDTO) {
        try {
            reservaService.crearReserva(reservaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservaDTO);
        } catch (DisponibilidadException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear la reserva: " + e.getMessage());
        }
    }

}
