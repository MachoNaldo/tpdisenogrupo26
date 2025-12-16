package grupo26diseno.tpdisenogrupo26.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo26diseno.tpdisenogrupo26.dtos.PersonaBusquedaDTO;
import grupo26diseno.tpdisenogrupo26.service.PersonaService;

@RestController
@RequestMapping("/api/personas")
public class PersonaBusquedaController {

    @Autowired
    private PersonaService personaService;

    @GetMapping("/buscar-por-cuit")
    public ResponseEntity<?> buscarPorCuit(@RequestParam String cuit) {
        try {
            PersonaBusquedaDTO resultado = personaService.buscarPorCuit(cuit);
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al buscar persona");
        }
    }
}