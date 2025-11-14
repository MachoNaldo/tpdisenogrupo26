package grupo26diseno.tpdisenogrupo26.config; 

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import grupo26diseno.tpdisenogrupo26.model.Usuario; 
import grupo26diseno.tpdisenogrupo26.repository.UsuarioRepository; 

@Configuration
public class DataInitializer {
    //usado para crear el usuario admin por defecto
    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.findByNombre("admin") == null) {
                Usuario admin = new Usuario();
                admin.setNombre("admin");
                admin.setContra("admin");
                
                usuarioRepository.save(admin);
            }
        };
    }
}