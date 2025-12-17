package grupo26diseno.tpdisenogrupo26.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyString;

import org.junit.jupiter.api.extension.ExtendWith; 
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension; 

import java.util.Optional;

import grupo26diseno.tpdisenogrupo26.model.Usuario;
import grupo26diseno.tpdisenogrupo26.repository.UsuarioRepository;


@ExtendWith(MockitoExtension.class) 
public class UsuarioServiceTest {

    @Mock 
    private UsuarioRepository usuarioRepository; 

    @InjectMocks 
    private UsuarioServiceImpl usuarioService; 

    //CREDENCIALES CORRECTAS (Cubre la ruta: Optional NO VACIO -> TRUE)
    @Test 
    public void autenticarUsuario_CredencialesCorrectas_RetornaTrue() {

        Usuario usuarioEncontrado = new Usuario(1L, "admin", "1234"); 

        when(usuarioRepository.findByNombreAndContra(anyString(), anyString()))
            .thenReturn(Optional.of(usuarioEncontrado));

        boolean resultado = usuarioService.autenticarUsuario("admin", "1234");

        assertTrue(resultado, "Debe retornar true si las credenciales coinciden.");
    }

    //REDENCIALES INCORRECTAS (Cubre la ruta: Optional VACÍO -> FALSE)

    @Test 
    public void autenticarUsuario_CredencialesIncorrectas_RetornaFalse() {
        
        when(usuarioRepository.findByNombreAndContra(anyString(), anyString()))
            .thenReturn(Optional.empty());

        boolean resultado = usuarioService.autenticarUsuario("Julio", "melonvino");

        assertFalse(resultado, "Debe retornar false si las credenciales NO coinciden.");
    }
}