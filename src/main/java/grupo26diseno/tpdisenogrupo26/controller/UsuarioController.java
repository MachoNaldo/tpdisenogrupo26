package grupo26diseno.tpdisenogrupo26.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import grupo26diseno.tpdisenogrupo26.model.Usuario;
import grupo26diseno.tpdisenogrupo26.service.UsuarioService;
import jakarta.servlet.http.HttpSession;

@RestController
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

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

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");

        if (usuario != null) {
            System.out.println("✓ Usuario " + usuario.getNombre() + " cerró sesión");
            session.invalidate();
        }

        return ResponseEntity.ok(Map.of("message", "Sesión cerrada"));
    }

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
