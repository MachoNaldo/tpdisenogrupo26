package grupo26diseno.tpdisenogrupo26.service;

import java.util.List;
import java.util.Optional;

import grupo26diseno.tpdisenogrupo26.dtos.ActualizarCuitCondicionFiscalDTO;
import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.excepciones.HuespedYaHospedadoException;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import jakarta.persistence.EntityNotFoundException;



public interface HuespedService {
    /**
     * Registra un nuevo huésped en el sistema.
     * Verifica si la dirección ya existe para reutilizarla.
     * @param huesped Datos del huésped a crear.
     * @param forzar Si es true, omite la validación de DNI duplicado.
     * @return La entidad Huesped creada.
     * @throws DocumentoUsadoException Si el DNI ya existe y forzar es false.
     */
    
    Huesped agregarHuesped(HuespedDTO huesped, boolean forzar) throws DocumentoUsadoException;

    /**
     * Busca un huésped por su ID.
     * @param id Identificador único.
     * @return Optional con el huésped si existe.
     */
    public Optional<Huesped> buscarHuespedPorId(Long id);

    /**
     * Búsqueda multicriterio de huéspedes.
     * @param apellido apellido del huésped.
     * @param nombres nombres del huésped.
     * @param tipoDocumento Enum del tipo de documento.
     * @param documentacion Número exacto del documento del huesped.
     * @return Lista de DTOs de Huespedes que coinciden con los filtros.
     */
    List<HuespedDTO> buscarHuespedesPorCriterios(String apellido, String nombres, TipoDoc tipoDocumento, String documentacion);
    
    /**
     * Elimina un huésped de la base de datos.
     * @param id ID del huésped a eliminar
     * @throws RuntimeException Si el huésped no existe.
     * @throws HuespedYaHospedadoException Si el huésped tiene estadías asociadas.
     */
    void eliminarHuesped(Long id);

    /**
     * Actualiza los datos fiscales de un huesped existente.
     * @param huespedId ID del huésped.
     * @param dto Datos nuevos de facturación.
     * @throws IllegalArgumentException Si el CUIT no es válido o el ID no existe.
     */
    public void actualizarCuitCondicionFiscal(Long huespedId, ActualizarCuitCondicionFiscalDTO dto);

    /**
     * Busca un huésped por su CUIT/CUIL, limpiando guiones o espacios.
     * @param cuit Cadena con el CUIT.
     * @return DTO del huésped encontrado.
     * @throws IllegalArgumentException Si no se encuentra ningún huésped.
     */
    public HuespedDTO buscarPorCuit(String cuit);

    /**
     * Obtiene un huésped por ID y lo retorna convertido a DTO.
     * @param id ID del huésped a buscar.
     * @return DTO del huésped encontrado.
     * @throws EntityNotFoundException Si el huésped no existe.
     */
    HuespedDTO obtenerPorId(Long id);

    /**
     * Verifica si ya existe un huésped con el mismo tipo y número de documento.
     * @param tipoDocumento Tipo de documento del huésped.
     * @param documentacion Número de documento del huésped.
     * @return true si ya existe un huésped con ese tipo y número de documento, false en caso contrario.
     */
    boolean existeDocumento(TipoDoc tipoDocumento, String documentacion);
    
    /**
     * Elimina un huésped basado en su CUIT.
     * @param cuit CUIT del huésped a eliminar.
     * @throws EntityNotFoundException Si no existe un huésped con ese CUIT.
     */
    void eliminarPorCuit(String cuit);


    /**
     * Actualiza los datos de un huésped existente.
     * @param id  ID del huésped a actualizar.
     * @param dto Datos del huésped a actualizar.
     * @return DTO del huésped actualizado.
     * @throws DocumentoUsadoException Si se intenta cambiar el documento a uno que ya posee otro huésped.
     */
    HuespedDTO actualizarHuesped(Long id, HuespedDTO dto) throws DocumentoUsadoException;

}
