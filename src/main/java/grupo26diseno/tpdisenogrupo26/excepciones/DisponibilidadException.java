package grupo26diseno.tpdisenogrupo26.excepciones;

public class DisponibilidadException extends Exception{
    public DisponibilidadException(String mensaje) {
        super(mensaje);
    }
    @Override
    public String toString() {
        return getMessage();
    }
}