package grupo26diseno.tpdisenogrupo26.config;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.TipoHabitacion;
import grupo26diseno.tpdisenogrupo26.model.Usuario;
import grupo26diseno.tpdisenogrupo26.repository.HabitacionRepository;
import grupo26diseno.tpdisenogrupo26.repository.UsuarioRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            UsuarioRepository usuarioRepository,
            HabitacionRepository habitacionRepository
    ) {
        return args -> {

            // --- 1. Carga de Usuario Admin ---
            if (usuarioRepository.findByNombre("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNombre("admin");
                admin.setContra("admin"); 
                usuarioRepository.save(admin);
                System.out.println(">>> Usuario admin creado.");
            }


            if (habitacionRepository.count() == 0) {
                System.out.println(">>> Iniciando carga de habitaciones...");


                AtomicLong numeroHabitacion = new AtomicLong(101);

                // Individual Estándar: 10
                crearLoteHabitaciones(habitacionRepository, 10, TipoHabitacion.IndividualEstandar, numeroHabitacion);

                // Doble Estándar: 18
                crearLoteHabitaciones(habitacionRepository, 18, TipoHabitacion.DobleEstandar, numeroHabitacion);

                // Doble Superior: 8
                crearLoteHabitaciones(habitacionRepository, 8, TipoHabitacion.DobleSuperior, numeroHabitacion);

                // Superior Family Plan: 10
                crearLoteHabitaciones(habitacionRepository, 10, TipoHabitacion.SuperiorFamilyPlan, numeroHabitacion);

                // Suite Doble: 2
                crearLoteHabitaciones(habitacionRepository, 2, TipoHabitacion.SuiteDoble, numeroHabitacion);

                System.out.println(">>> Carga de habitaciones finalizada. Total: " + habitacionRepository.count());
            }
        };
    }

    // Metodo auxiliar para no repetir el bucle for
    private void crearLoteHabitaciones(HabitacionRepository repo, int cantidad, TipoHabitacion tipo, AtomicLong contador) {
        for (int i = 0; i < cantidad; i++) {
            Habitacion h = new Habitacion();
            h.setNumero(contador.getAndIncrement()); // Asigna número y aumenta (101, 102, 103...)
            h.setTipo(tipo);

            repo.save(h);
        }
    }
}