package grupo26diseno.tpdisenogrupo26; 

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API Hotel Grupo 26",
        version = "1.0.0",
        description = "Documentación del TP de Diseño"
    )
)
public class OpenApiConfig {
}