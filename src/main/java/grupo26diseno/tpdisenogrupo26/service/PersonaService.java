package grupo26diseno.tpdisenogrupo26.service;

import grupo26diseno.tpdisenogrupo26.dtos.PersonaBusquedaDTO;

public interface PersonaService {
    /**
     * Busca una persona por su CUIT/CUIL en la base de datos.
     * @param cuit Número de identificación fiscal.
     * @return DTO con los datos unificados de la persona encontrada.
     * @throws IllegalArgumentException Si el CUIT no existe en ninguna tabla.
     */
    public PersonaBusquedaDTO buscarPorCuit(String cuit);
}
