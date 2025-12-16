package grupo26diseno.tpdisenogrupo26.service;

import grupo26diseno.tpdisenogrupo26.dtos.PersonaBusquedaDTO;

public interface PersonaService {
    public PersonaBusquedaDTO buscarPorCuit(String cuit);
}
