package grupo26diseno.tpdisenogrupo26.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;

import grupo26diseno.tpdisenogrupo26.dtos.ResponsablePagoDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.mapper.ResponsablePagoMapper;
import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;
import grupo26diseno.tpdisenogrupo26.service.ResponsablePagoService;


@RestController
@RequestMapping("/api/responsablespago")
@Tag(name = "Gestión de Responsables de Pago", description = "Administración de titulares para la facturación")
public class ResponsablePagoController {

    @Autowired
    private ResponsablePagoService responsablePagoService;

    @Autowired
    private ResponsablePagoMapper responsablePagoMapper;

    @Operation(summary = "Crear responsable de pago", description = "Registra una entidad o persona para facturar.")
    @ApiResponse(responseCode = "201", description = "Responsable creado exitosamente")
    @ApiResponse(responseCode = "409", description = "El documento/CUIT ya está registrado")

    @PostMapping("/crear")
    public ResponseEntity<?> crear(
            @RequestBody ResponsablePagoDTO dto,@Parameter(description = "Permite duplicados si es true")
            @RequestParam(defaultValue = "false") boolean forzar) {

        try {
            ResponsablePago creado =
                    responsablePagoService.crearResponsablePago(dto, forzar);

            ResponsablePagoDTO responseDTO =
                    responsablePagoMapper.crearDTO(creado);

            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);

        } catch (DocumentoUsadoException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @Operation(summary = "Buscar por CUIT", description = "Busca un responsable de pago activo por su CUIT.")
    @ApiResponse(responseCode = "200", description = "Encontrado.")
    @ApiResponse(responseCode = "404", description = "No existe responsable con ese CUIT.")

    @GetMapping("/buscar-por-cuit")
    public ResponseEntity<ResponsablePagoDTO> buscarPorCuit(@RequestParam String cuit) {
        return responsablePagoService.buscarResponsablePagoPorCuit(cuit)
                .map(rp -> ResponseEntity.ok(responsablePagoMapper.crearDTO(rp)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

}
