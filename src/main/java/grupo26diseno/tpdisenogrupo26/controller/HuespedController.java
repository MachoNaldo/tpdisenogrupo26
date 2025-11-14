package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.service.HuespedService;

@RestController
public class HuespedController {

    @Autowired
    private HuespedService huespedService;

    @PostMapping("/crearhuesped")
    public ResponseEntity<?> agregarHuesped(@RequestBody Huesped huesped, @RequestParam(defaultValue = "false") boolean forzar) {
        try {
            LocalDate hoy = LocalDate.now();
            LocalDate nacimiento = huesped.getFechaNacimiento().toInstant()
            .atZone(ZoneId.systemDefault())
            .toLocalDate();
            int edad = Period.between(nacimiento, hoy).getYears();
            huesped.setEdad(edad);
            Huesped nuevoHuesped = huespedService.agregarHuesped(huesped, forzar);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoHuesped);
        } catch (DocumentoUsadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}
