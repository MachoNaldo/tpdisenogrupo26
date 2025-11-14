package grupo26diseno.tpdisenogrupo26.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpSession;

@Controller
public class VistasController {
    @GetMapping("/login")
    public String mostrarLogin() {
        return "login";
    }
    @GetMapping("/index")
    public String volverIndex() {
        return "index";
    }
    @GetMapping("/menu")
    public String menu(HttpSession session) {
        Boolean autenticado = (Boolean) session.getAttribute("autenticado");
        
        if (autenticado == null || !autenticado) {
            return "redirect:/login";
        }
        return "menu";
    }
    @GetMapping("/crearhuesped")
    public String crearHuesped(HttpSession session) {
        Boolean autenticado = (Boolean) session.getAttribute("autenticado");
        
        if (autenticado == null || !autenticado) {
            return "redirect:/login";
        }
        return "crearhuesped";
    }
}
