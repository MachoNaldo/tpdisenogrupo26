package grupo26diseno.tpdisenogrupo26.excepciones;

public class DatosInvalidosException extends Exception{
    public DatosInvalidosException(String mensaje) {
        super(mensaje);
    }
    @Override
    public String toString() {
        return getMessage();
    }
}