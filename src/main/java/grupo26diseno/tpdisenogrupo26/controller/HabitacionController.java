package grupo26diseno.tpdisenogrupo26.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import grupo26diseno.tpdisenogrupo26.dtos.DisponibilidadDTO;
import grupo26diseno.tpdisenogrupo26.service.HabitacionService;

@RestController
@RequestMapping("/api/habitaciones")
public class HabitacionController {

    @Autowired
    private HabitacionService habitacionService;

    @GetMapping("/disponibilidad")
    public List<DisponibilidadDTO> disponibilidad(
        @RequestParam String desde,
        @RequestParam String hasta
    ) {
        LocalDate f1 = LocalDate.parse(desde);
        LocalDate f2 = LocalDate.parse(hasta);

        return habitacionService.obtenerDisponibilidad(f1, f2);
    }

}

