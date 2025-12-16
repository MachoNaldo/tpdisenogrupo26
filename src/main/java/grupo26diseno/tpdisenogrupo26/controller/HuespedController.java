package grupo26diseno.tpdisenogrupo26.controller;

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

import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.excepciones.HuespedYaHospedadoException;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import grupo26diseno.tpdisenogrupo26.service.HuespedService;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/huespedes")
public class HuespedController {

    @Autowired
    private HuespedService huespedService;

    @PostMapping("/crearhuesped")
    public ResponseEntity<?> agregarHuesped(@RequestBody HuespedDTO huesped,
            @RequestParam(defaultValue = "false") boolean forzar) {
        try {
            huespedService.agregarHuesped(huesped, forzar);
            return ResponseEntity.status(HttpStatus.CREATED).body(huesped);
        } catch (DocumentoUsadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @GetMapping("/buscar")
    public List<HuespedDTO> buscarHuespedes(
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String nombres,
            @RequestParam(required = false) TipoDoc tipoDocumento,
            @RequestParam(required = false) String documentacion) {

        return huespedService.buscarHuespedesPorCriterios(apellido, nombres, tipoDocumento, documentacion);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            huespedService.eliminarHuesped(id);
            return ResponseEntity.noContent().build(); // 204 si se elimina
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (HuespedYaHospedadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT) // 409 si agarra esta excepcion
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado al intentar eliminar el huésped.");
        }
    }
}