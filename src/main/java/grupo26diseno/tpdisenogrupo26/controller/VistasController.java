package grupo26diseno.tpdisenogrupo26.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.service.HuespedService;
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

    @Autowired
    private HuespedService huespedService;
   /* Metodo deprecado, se usa el de HuespedController
    @GetMapping("/huespedes")
    public String listarHuespedes(Model model, HttpSession session) {
        Boolean autenticado = (Boolean) session.getAttribute("autenticado");

        if (autenticado == null || !autenticado) {
            return "redirect:/login";
        }
        List<Huesped> huespedes = huespedService.listarHuespedes();
        model.addAttribute("huespedes", huespedes);
        return "huespedes";
    } */
}
