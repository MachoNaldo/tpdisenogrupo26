package grupo26diseno.tpdisenogrupo26.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
/* SE PUEDE BORRAR ESTO
    @Bean
    CommandLineRunner initDatabase(
            UsuarioRepository usuarioRepository,
            HabitacionRepository habitacionRepository,
            PeriodoRepository periodoEstadoRepository
    ) {
        return args -> {

       
            if (usuarioRepository.findByNombre("admin") == null) {
                Usuario admin = new Usuario();
                admin.setNombre("admin");
                admin.setContra("admin");
                usuarioRepository.save(admin);
                System.out.println(">>> Usuario admin creado.");
            }

            LocalDate inicio = LocalDate.of(2025, 8, 1);
            LocalDate fin = LocalDate.of(2026, 8, 1);

            for (Habitacion hab : habitacionRepository.findAll()) {

                LocalDate actual = inicio;

                while (!actual.isAfter(fin)) {

                    boolean existe = periodoEstadoRepository.existsByHabitacionNumeroAndFechaInicio(hab.getNumero(), actual);

                    if (!existe) {
                        PeriodoEstado p = new PeriodoEstado();
                        p.setHabitacion(hab);
                        p.setFechaInicio(actual);
                        p.setFechaFin(actual);
                        p.setTipoEstado(TipoEstadoHabitacion.LIBRE);

                        periodoEstadoRepository.save(p);
                    }

                    actual = actual.plusDays(1);
                }
            }

            System.out.println(">>> Periodos iniciales de estado generados correctamente.");
        };
    }*/
}
