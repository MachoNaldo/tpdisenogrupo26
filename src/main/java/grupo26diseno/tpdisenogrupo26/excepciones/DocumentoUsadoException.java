
package grupo26diseno.tpdisenogrupo26.excepciones;


public class DocumentoUsadoException extends Exception{
    public DocumentoUsadoException(String mensaje) {
        super(mensaje);
    }
    @Override
    public String toString() {
        return getMessage();
    }
}
