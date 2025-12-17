package grupo26diseno.tpdisenogrupo26.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

import grupo26diseno.tpdisenogrupo26.dtos.PersonaBusquedaDTO;
import grupo26diseno.tpdisenogrupo26.service.PersonaService;

@RestController
@RequestMapping("/api/personas")
@Tag(name = "Búsqueda de Personas", description = "Servicio auxiliar para buscar datos de personas por identificadores fiscales")
public class PersonaBusquedaController {

    @Autowired
    private PersonaService personaService;

    @GetMapping("/buscar-por-cuit")
    @Operation(summary = "Buscar por CUIT", description = "Recupera los datos básicos de una persona dado su CUIT/CUIL.")
    @ApiResponse(responseCode = "200", description = "Persona encontrada.",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = PersonaBusquedaDTO.class))
    )
    @ApiResponse(responseCode = "404", description = "No existe ninguna persona con ese CUIT.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor.")
    public ResponseEntity<?> buscarPorCuit(@Parameter(description = "CUIT/CUIL sin guiones o con guiones") @RequestParam String cuit) {
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