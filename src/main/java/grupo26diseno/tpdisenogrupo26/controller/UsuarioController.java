package grupo26diseno.tpdisenogrupo26.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import grupo26diseno.tpdisenogrupo26.model.Usuario;
import grupo26diseno.tpdisenogrupo26.service.UsuarioService;
import jakarta.servlet.http.HttpSession;

@RestController
@Tag(name = "Gestión de Usuarios", description = "Operaciones de autenticación y gestión de sesiones")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Operation(summary = "Iniciar sesión", description = "Valida credenciales y crea una sesión HTTP.")
    @ApiResponse(responseCode = "200", description = "Login exitoso.")
    @ApiResponse(responseCode = "400", description = "Usuario o contraseña incorrectos.")

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario, HttpSession session) {
        boolean valido = usuarioService.autenticarUsuario(usuario.getNombre(), usuario.getContra());
        if (valido) {
            session.setAttribute("usuario", usuario);
            return ResponseEntity.ok(Map.of("success", true, "usuario", usuario));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body("{\"error\": \"Usuario o contraseña incorrectos\"}");
        }
    }

    @Operation(summary = "Cerrar sesión", description = "Invalida la sesión actual.")
    @ApiResponse(responseCode = "200", description = "Sesión cerrada correctamente.")

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario != null) {
            System.out.println("✓ Usuario " + usuario.getNombre() + " cerró sesión");
            session.invalidate();
        }

        return ResponseEntity.ok(Map.of("message", "Sesión cerrada"));
    }

    @Operation(summary = "Verificar sesión activa", description = "Comprueba si el usuario tiene una sesión válida.")
    @ApiResponse(responseCode = "200", description = "Usuario autenticado.")
    @ApiResponse(responseCode = "401", description = "No hay sesión activa.")

    @GetMapping("/revisar-sesion")
    public ResponseEntity<?> checkSession(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            return ResponseEntity.ok(Map.of(
                    "autenticado", true,
                    "usuario", usuario
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("autenticado", false));
    }

    

}
