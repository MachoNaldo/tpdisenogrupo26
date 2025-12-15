package grupo26diseno.tpdisenogrupo26.excepciones;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Esta excepcion si es lanzada devolvera un status 409 CONFLICT
@ResponseStatus(value = HttpStatus.CONFLICT)
public class HuespedYaHospedadoException extends RuntimeException {
    public HuespedYaHospedadoException(String mensaje) {
        super(mensaje);
    }
}