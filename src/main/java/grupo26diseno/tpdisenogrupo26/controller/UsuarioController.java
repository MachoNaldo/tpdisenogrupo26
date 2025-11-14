package grupo26diseno.tpdisenogrupo26.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
            session.setAttribute("usuario", usuario.getNombre());
            session.setAttribute("autenticado", true);
            return ResponseEntity.ok().body("{\"success\": true}");
        } else {
            return ResponseEntity
                    .badRequest()
                    .body("{\"error\": \"Usuario o contraseña incorrectos\"}");
        }
    }
}
