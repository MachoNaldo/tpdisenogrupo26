package grupo26diseno.tpdisenogrupo26.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;


import grupo26diseno.tpdisenogrupo26.dtos.ActualizarCuitCondicionFiscalDTO;
import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.excepciones.HuespedYaHospedadoException;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import grupo26diseno.tpdisenogrupo26.service.HuespedService;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/huespedes")
@Tag(name = "Gestión de Huéspedes", description = "ABM de huéspedes y búsqueda multicriterio")
public class HuespedController {

    @Autowired
    private HuespedService huespedService;

    @Operation(summary = "Crear nuevo huésped", description = "Registra un cliente. Si el DNI ya existe, devuelve 409 salvo que forzar=true.")
    @ApiResponse(responseCode = "201", description = "Huésped creado exitosamente",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = HuespedDTO.class))
    )
    @ApiResponse(responseCode = "409", description = "El documento ya está registrado")

    @PostMapping("/crearhuesped")
    public ResponseEntity<?> agregarHuesped(@RequestBody HuespedDTO huesped, @Parameter(description = "Permite duplicados si es true")
            @RequestParam(defaultValue = "false") boolean forzar) {
            
        try {
            huespedService.agregarHuesped(huesped, forzar);
            return ResponseEntity.status(HttpStatus.CREATED).body(huesped);
        } catch (DocumentoUsadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
 
    

    @Operation(summary = "Validar si existe documento", description = "Devuelve true si el documento ya está registrado.")
    @ApiResponse(responseCode = "200", description = "Consulta exitosa")
    @PostMapping("/validar-documento")
    public ResponseEntity<?> validarDocumento(
            @RequestParam TipoDoc tipoDocumento,
            @RequestParam String documentacion) {
        try {
            boolean existe = huespedService.existeDocumento(tipoDocumento, documentacion);
            return ResponseEntity.ok(existe); // true/false
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al validar documento");
        }
    }



    @Operation(summary = "Buscar huéspedes", description = "Filtra por nombre, apellido, tipo o nro documento. Si no envías nada, lista todos.")
    @ApiResponse(responseCode = "200", description = "Búsqueda exitosa")
    @GetMapping("/buscar")
    public List<HuespedDTO> buscarHuespedes(
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String nombres,
            @RequestParam(required = false) TipoDoc tipoDocumento,
            @RequestParam(required = false) String documentacion) {

        return huespedService.buscarHuespedesPorCriterios(apellido, nombres, tipoDocumento, documentacion);
    }
    
    @Operation(summary = "Eliminar un huésped", description = "Borra físicamente al huésped de la base de datos por su ID.")
    @ApiResponse(responseCode = "204", description = "Eliminado correctamente.")
    @ApiResponse(responseCode = "404", description = "ID de huésped no encontrado.")
    @ApiResponse(responseCode = "409", description = "No se puede eliminar: El huésped tiene reservas activas.")
    @ApiResponse(responseCode = "500", description = "Error interno del servidor.")

   @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            huespedService.eliminarHuesped(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (HuespedYaHospedadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado al intentar eliminar el huésped.");
        }
    }

    @Operation(summary = "Eliminar por CUIT", description = "Elimina un huésped buscando por su CUIT.")
    @ApiResponse(responseCode = "204", description = "Eliminado correctamente.")
    @ApiResponse(responseCode = "404", description = "Huésped no encontrado.")
    @ApiResponse(responseCode = "409", description = "No se puede eliminar (tiene reservas).")
   @DeleteMapping("/eliminar-por-cuit")
    public ResponseEntity<?> eliminarPorCuit(@RequestParam String cuit) {
        try {
            huespedService.eliminarPorCuit(cuit);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (HuespedYaHospedadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error inesperado al intentar eliminar el huésped.");
        }
    }


    @Operation(summary = "Actualizar datos fiscales", description = "Modifica el CUIT y la Condición Fiscal de un huésped existente.")
    @ApiResponse(responseCode = "200", description = "Datos actualizados correctamente")
    @ApiResponse(responseCode = "400", description = "Datos inválidos en el DTO")
    @ApiResponse(responseCode = "500", description = "Error interno al actualizar")

    @PatchMapping("/{id}")
    public ResponseEntity<?> actualizarCuitCondicionFiscal(
            @PathVariable Long id,
            @RequestBody ActualizarCuitCondicionFiscalDTO dto) {
        try {
            huespedService.actualizarCuitCondicionFiscal(id, dto);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar el huésped");
        }
    }

    
    @Operation(summary = "Obtener huésped por ID", description = "Recupera datos completos de un huésped.")
    @ApiResponse(responseCode = "200", description = "Huésped encontrado",
    content = @Content(mediaType = "application/json", schema = @Schema(implementation = HuespedDTO.class))
    )
@ApiResponse(responseCode = "404", description = "No encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            HuespedDTO huesped = huespedService.obtenerPorId(id);
            return ResponseEntity.ok(huesped);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al obtener el huésped");
        }
    }
    
    @Operation(summary = "Actualizar Huésped completo", description = "Reemplaza los datos del huésped.")
    @ApiResponse(responseCode = "200", description = "Actualizado exitosamente",
    content = @Content(mediaType = "application/json", schema = @Schema(implementation = HuespedDTO.class))
    )
@ApiResponse(responseCode = "404", description = "No encontrado")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarHuesped(@PathVariable Long id, @RequestBody HuespedDTO dto) {
        try {
            HuespedDTO actualizado = huespedService.actualizarHuesped(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (DocumentoUsadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al actualizar el huésped");
        }
    }

    @Operation(summary = "Buscar por CUIT", description = "Busca un huésped específico por su número de CUIT.")
    @ApiResponse(responseCode = "200", description = "Huésped encontrado",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = HuespedDTO.class))
    )
    @ApiResponse(responseCode = "404", description = "No existe huésped con ese CUIT")
    @GetMapping("/buscar-por-cuit")
    public ResponseEntity<?> buscarPorCuit(@RequestParam String cuit) {
        try {
            HuespedDTO huesped = huespedService.buscarPorCuit(cuit);
            return ResponseEntity.ok(huesped);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al buscar huésped");
        }
    }
}
