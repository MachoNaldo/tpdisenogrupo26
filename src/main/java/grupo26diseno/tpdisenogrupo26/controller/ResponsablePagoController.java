package grupo26diseno.tpdisenogrupo26.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import grupo26diseno.tpdisenogrupo26.dtos.ResponsablePagoDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.mapper.ResponsablePagoMapper;
import grupo26diseno.tpdisenogrupo26.model.ResponsablePago;
import grupo26diseno.tpdisenogrupo26.service.ResponsablePagoService;


@RestController
@RequestMapping("/api/responsablespago")
public class ResponsablePagoController {

    @Autowired
    private ResponsablePagoService responsablePagoService;

    @Autowired
    private ResponsablePagoMapper responsablePagoMapper;

    @PostMapping("/crear")
    public ResponseEntity<?> crear(
            @RequestBody ResponsablePagoDTO dto,
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

    @GetMapping("/buscar-por-cuit")
    public ResponseEntity<ResponsablePagoDTO> buscarPorCuit(@RequestParam String cuit) {
        return responsablePagoService.buscarResponsablePagoPorCuit(cuit)
                .map(rp -> ResponseEntity.ok(responsablePagoMapper.crearDTO(rp)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

}
