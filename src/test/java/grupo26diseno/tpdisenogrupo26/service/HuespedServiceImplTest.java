package grupo26diseno.tpdisenogrupo26.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;


import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito; 
import org.mockito.junit.jupiter.MockitoExtension;

import grupo26diseno.tpdisenogrupo26.dtos.ActualizarCuitCondicionFiscalDTO;
import grupo26diseno.tpdisenogrupo26.dtos.DireccionDTO;
import grupo26diseno.tpdisenogrupo26.dtos.HuespedDTO;
import grupo26diseno.tpdisenogrupo26.excepciones.DocumentoUsadoException;
import grupo26diseno.tpdisenogrupo26.excepciones.HuespedYaHospedadoException;
import grupo26diseno.tpdisenogrupo26.mapper.DireccionMapper;
import grupo26diseno.tpdisenogrupo26.mapper.HuespedMapper;
import grupo26diseno.tpdisenogrupo26.model.CondicionFiscal;
import grupo26diseno.tpdisenogrupo26.model.Direccion;
import grupo26diseno.tpdisenogrupo26.model.Huesped;
import grupo26diseno.tpdisenogrupo26.model.TipoDoc;
import grupo26diseno.tpdisenogrupo26.model.TipoSexo;
import grupo26diseno.tpdisenogrupo26.repository.DireccionRepository;
import grupo26diseno.tpdisenogrupo26.repository.EstadiaRepository;
import grupo26diseno.tpdisenogrupo26.repository.HuespedRepository;
import jakarta.persistence.EntityNotFoundException;


@ExtendWith(MockitoExtension.class)
public class HuespedServiceImplTest {

    @Mock private HuespedRepository huespedRepository;
    @Mock private EstadiaRepository estadiaRepository;
    @Mock private DireccionRepository direccionRepository;
    @Mock private HuespedMapper huespedMapper;
    @Mock private DireccionMapper direccionMapper;
    
    @InjectMocks
    private HuespedServiceImpl huespedService;

    private final Long HUESPED_ID = 1L;
    private Huesped HUESPED_MOCK_SAVE; 
    private final Direccion DIRECCION_MOCK; 
    public HuespedServiceImplTest() {
        DIRECCION_MOCK = new Direccion();
        DIRECCION_MOCK.setNombreCalle("Calle");
        DIRECCION_MOCK.setNumCalle(123);
        DIRECCION_MOCK.setCodPostal("1234");
        DIRECCION_MOCK.setLocalidad("Localidad");
        DIRECCION_MOCK.setProvincia("Provincia");
        DIRECCION_MOCK.setPais("País");
    }

    @BeforeEach
    void setUp() {
        HUESPED_MOCK_SAVE = mock(Huesped.class); 
    }

    private HuespedDTO crearHuespedDTO(boolean conDireccion) {
        HuespedDTO dto = new HuespedDTO();
        dto.setTipoDocumento(TipoDoc.DNI.toString());
        dto.setDocumentacion("12345678");
        dto.setNombres("Julio");
        dto.setApellido("Roca");
        dto.setEdad(30);
        dto.setFechaNacimiento(LocalDate.of(1995, 1, 1));
        dto.setCondicionFiscal(CondicionFiscal.CONSUMIDOR_FINAL.toString()); 
        dto.setSexo(TipoSexo.Masculino.toString()); 
        
        if (conDireccion) {
            DireccionDTO dirDTO = new DireccionDTO();
            dirDTO.setNombreCalle(DIRECCION_MOCK.getNombreCalle());
            dirDTO.setNumCalle(DIRECCION_MOCK.getNumCalle());
            dirDTO.setCodPostal(DIRECCION_MOCK.getCodPostal());
            dirDTO.setLocalidad(DIRECCION_MOCK.getLocalidad());
            dirDTO.setProvincia(DIRECCION_MOCK.getProvincia()); 
            dirDTO.setPais(DIRECCION_MOCK.getPais());
            dto.setDireccion(dirDTO);
        }
        return dto;
    }

    // TESTS PARA: obtenerPorId(Long id)

    @Test
    @DisplayName("Debe retornar HuespedDTO con Dirección si el huesped existe y tiene direccion")
    void obtenerPorId_HuespedConDireccion_RetornaDTOCompleto() {
        Long id = 1L;
        
        Huesped huespedEncontrado = mock(Huesped.class);
        Direccion direccionEncontrada = DIRECCION_MOCK;
        HuespedDTO huespedDTO = new HuespedDTO();
        DireccionDTO direccionDTO = new DireccionDTO();

        when(huespedRepository.findById(id)).thenReturn(Optional.of(huespedEncontrado));
        when(huespedMapper.crearDTO(huespedEncontrado)).thenReturn(huespedDTO);
        when(huespedEncontrado.getDireccion()).thenReturn(direccionEncontrada);
        when(direccionMapper.crearDTO(direccionEncontrada)).thenReturn(direccionDTO);

        HuespedDTO resultado = huespedService.obtenerPorId(id);

        assertNotNull(resultado);
        assertNotNull(resultado.getDireccion());
        assertEquals(direccionDTO, resultado.getDireccion());
        verify(direccionMapper, times(1)).crearDTO(direccionEncontrada);
    }
    
    @Test
    @DisplayName("Debe retornar HuespedDTO sin Direccionn si el huesped existe, pero su direccion es nula")
    void obtenerPorId_HuespedSinDireccion_RetornaDTOSinDireccion() {
        Long id = 2L;
        
        Huesped huespedEncontrado = mock(Huesped.class); 
        HuespedDTO huespedDTO = new HuespedDTO();
        
        when(huespedRepository.findById(id)).thenReturn(Optional.of(huespedEncontrado));
        when(huespedMapper.crearDTO(huespedEncontrado)).thenReturn(huespedDTO);
        when(huespedEncontrado.getDireccion()).thenReturn(null);

        HuespedDTO resultado = huespedService.obtenerPorId(id);

        assertNotNull(resultado);
        assertNull(resultado.getDireccion());
        verify(direccionMapper, never()).crearDTO(any());
    }

    @Test
    @DisplayName("Debe lanzar EntityNotFoundException si el huesped no existe")
    void obtenerPorId_HuespedNoExiste_DebeLanzarExcepcion() {
        Long id = 99L;
        
        when(huespedRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            huespedService.obtenerPorId(id);
        }, "Debe lanzar EntityNotFoundException si el ID no se encuentra.");
        
        verify(huespedMapper, never()).crearDTO(any());
    }

    // TESTS PARA: agregarHuesped(HuespedDTO huesped, boolean forzar)
    
    @Test
    @DisplayName("Tiene que guardar un huesped nuevo con validacion activa y crear una nueva direcccion")
    void agregarHuesped_NuevoSinForzarYDireccionNueva_DebeGuardar() {
        
        HuespedDTO dto = crearHuespedDTO(true);     
        
        when(huespedRepository.findByTipoDocumentoAndDocumentacion(any(), anyString()))
            .thenReturn(Collections.emptyList());     
        
        when(direccionRepository.findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
            anyString(), anyInt(), anyString(), anyString(), anyString(), anyString()))
            .thenReturn(Optional.empty());
        
        when(huespedMapper.crearEntidad(dto)).thenReturn(HUESPED_MOCK_SAVE);
        when(huespedRepository.save(HUESPED_MOCK_SAVE)).thenReturn(HUESPED_MOCK_SAVE);

        Huesped resultado = assertDoesNotThrow(() -> huespedService.agregarHuesped(dto, false));

        assertNotNull(resultado);
        verify(huespedRepository, times(1)).save(HUESPED_MOCK_SAVE);
    }

    @Test
    @DisplayName("Debe lanzar DocumentoUsadoException si el documento ya esta registrado y 'forzar' es false")
    void agregarHuesped_DocumentoExistenteSinForzar_DebeLanzarExcepcion() {
        
        HuespedDTO dto = crearHuespedDTO(false);
        Huesped huespedExistente = new Huesped();
        huespedExistente.setTipoDocumento(TipoDoc.DNI);
        huespedExistente.setDocumentacion("12345678");
        
        when(huespedRepository.findByTipoDocumentoAndDocumentacion(any(), anyString()))
            .thenReturn(List.of(huespedExistente));     
        
        assertThrows(DocumentoUsadoException.class, () -> huespedService.agregarHuesped(dto, false));
             
        verify(huespedRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe guardar aunque el documento exista si 'forzar' es true")
    void agregarHuesped_DocumentoExistenteForzado_DebeGuardar() {

        HuespedDTO dto = crearHuespedDTO(false);
        
        when(huespedMapper.crearEntidad(dto)).thenReturn(HUESPED_MOCK_SAVE);
        when(huespedRepository.save(HUESPED_MOCK_SAVE)).thenReturn(HUESPED_MOCK_SAVE);

        Huesped resultado = assertDoesNotThrow(() -> huespedService.agregarHuesped(dto, true));

        assertNotNull(resultado);
        verify(huespedRepository, never()).findByTipoDocumentoAndDocumentacion(any(), anyString()); 
        verify(huespedRepository, times(1)).save(HUESPED_MOCK_SAVE);
    }
    
    @Test
    @DisplayName("Debe usar la Direccion existente si se encuentra")
    void agregarHuesped_ConDireccionExistente_DebeReusarDireccion() {
        HuespedDTO dto = crearHuespedDTO(true);     
        
        when(huespedRepository.findByTipoDocumentoAndDocumentacion(any(), anyString()))
            .thenReturn(Collections.emptyList());     
        
        when(direccionRepository.findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
            anyString(), anyInt(), anyString(), anyString(), anyString(), anyString()))
            .thenReturn(Optional.of(DIRECCION_MOCK));
        
        when(huespedMapper.crearEntidad(dto)).thenReturn(HUESPED_MOCK_SAVE);
        when(huespedRepository.save(HUESPED_MOCK_SAVE)).thenReturn(HUESPED_MOCK_SAVE);

        assertDoesNotThrow(() -> huespedService.agregarHuesped(dto, false));

        verify(HUESPED_MOCK_SAVE, times(1)).setDireccion(DIRECCION_MOCK);     
        verify(huespedRepository, times(1)).save(HUESPED_MOCK_SAVE);
    }
    
    // TESTS PARA: buscarHuespedPorId(Long id)

    @Test
    @DisplayName("Debe retornar el Optional con Huesped si el ID existe")
    void buscarHuespedPorId_Existente_RetornaOptionalConHuesped() {
        Long id = 5L;
        Huesped huespedMock = new Huesped();
        when(huespedRepository.findById(id)).thenReturn(Optional.of(huespedMock));

        Optional<Huesped> resultado = huespedService.buscarHuespedPorId(id);

        assertTrue(resultado.isPresent());
        assertEquals(huespedMock, resultado.get());
        verify(huespedRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("Debe retornar Optional vacío si el ID no existe")
    void buscarHuespedPorId_NoExistente_RetornaOptionalVacio() {
        Long id = 99L;
        when(huespedRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Huesped> resultado = huespedService.buscarHuespedPorId(id);

        assertFalse(resultado.isPresent());
        verify(huespedRepository, times(1)).findById(id);
    }

    // TESTS PARA: buscarHuespedesPorCriterios

    @Test
    @DisplayName("Debe buscar huespedes por criterios y mapear a lista de DTOs")
    void buscarHuespedesPorCriterios_CriteriosValidos_RetornaListaDTO() {
        // ARRANGE
        String apellido = "Roca";
        TipoDoc tipoDoc = TipoDoc.DNI;
        
        Huesped h1 = new Huesped();
        Huesped h2 = new Huesped();
        List<Huesped> listaEntidades = List.of(h1, h2);

        HuespedDTO dto1 = new HuespedDTO();
        HuespedDTO dto2 = new HuespedDTO();
        
        when(huespedRepository.buscarPorCriterios(
                any(), 
                any(), 
                eq(tipoDoc), 
                any()
            ))
            .thenReturn(listaEntidades);
        
        when(huespedMapper.crearDTO(h1)).thenReturn(dto1);
        when(huespedMapper.crearDTO(h2)).thenReturn(dto2);

        List<HuespedDTO> resultado = huespedService.buscarHuespedesPorCriterios(apellido, null, tipoDoc, null);

        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        
        verify(huespedRepository, times(1)).buscarPorCriterios(any(), any(), eq(tipoDoc), any());
        verify(huespedMapper, times(2)).crearDTO(any(Huesped.class));
    }

    // TESTS PARA: buscarPorCuit(String cuit)

    @Test
    @DisplayName("Debe retornar HuespedDTO si encuentra por CUIT vaalido")
    void buscarPorCuit_CuitValido_RetornaDTO() {
        String cuitSinGuion = "20123456789";
        String cuitConFormato = "20-12345678-9";
        
        Huesped huespedMock = new Huesped();
        HuespedDTO huespedDTO = new HuespedDTO();

        when(huespedRepository.findByCuit(cuitSinGuion)).thenReturn(Optional.of(huespedMock));
        when(huespedMapper.crearDTO(huespedMock)).thenReturn(huespedDTO);

        HuespedDTO resultado = huespedService.buscarPorCuit(cuitConFormato);

        assertNotNull(resultado);
        assertEquals(huespedDTO, resultado);
        verify(huespedRepository, times(1)).findByCuit(cuitSinGuion);
    }

    @Test
    @DisplayName("Debe lanzar IllegalArgumentException si no encuentra el CUIT")
    void buscarPorCuit_CuitNoExiste_LanzaExcepcion() {
        String cuitNoExistente = "99999999999";
        
        when(huespedRepository.findByCuit(cuitNoExistente)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            huespedService.buscarPorCuit(cuitNoExistente);
        }, "Debe lanzar IllegalArgumentException si el CUIT no existe.");
        
        verify(huespedRepository, times(1)).findByCuit(cuitNoExistente);
    }

    // TESTS PARA: existeDocumento(TipoDoc tipoDocumento, String documentacion)

    @Test
    @DisplayName("Debe retornar TRUE si el documento existe en el repositorio")
    void existeDocumento_DocumentoExistente_RetornaTrue() {
        when(huespedRepository.existsByTipoDocumentoAndDocumentacion(eq(TipoDoc.DNI), eq("12345678"))).thenReturn(true);
        
        boolean resultado = huespedService.existeDocumento(TipoDoc.DNI, "12345678");

        assertTrue(resultado);
        verify(huespedRepository, times(1)).existsByTipoDocumentoAndDocumentacion(TipoDoc.DNI, "12345678");
    }

    @Test
    @DisplayName("Debe retornar FALSE si el documento no existe")
    void existeDocumento_DocumentoNoExistente_RetornaFalse() {
        when(huespedRepository.existsByTipoDocumentoAndDocumentacion(any(), anyString())).thenReturn(false);

        boolean resultado = huespedService.existeDocumento(TipoDoc.PASAPORTE, "P98765");

        assertFalse(resultado);
    }

    @Test
    @DisplayName("Debe retornar FALSE si el tipo de documento es nulo o la documentacion es nula/vacia")
    void existeDocumento_ArgumentosNulosOVacios_RetornaFalse() {
        assertFalse(huespedService.existeDocumento(null, "123"));
        assertFalse(huespedService.existeDocumento(TipoDoc.DNI, null));
        assertFalse(huespedService.existeDocumento(TipoDoc.DNI, "  "));
        
        verify(huespedRepository, never()).existsByTipoDocumentoAndDocumentacion(any(), anyString());
    }
    
    // TESTS PARA: actualizarHuesped(Long id, HuespedDTO dto)

    @Test
    @DisplayName("Debe actualizar todos los campos incluyendo DNI y direccion nueva")
    void actualizarHuesped_DatosCompletos_ActualizaYGuardaNuevaDireccion() {
        Long id = 1L;
        HuespedDTO dtoActualizado = crearHuespedDTO(true);
        dtoActualizado.setDocumentacion("99999999"); 
        
        Huesped huespedExistente = mock(Huesped.class);
        Direccion nuevaDireccion = new Direccion(); 
        
        //El huésped a actualizar existe
        when(huespedRepository.findById(id)).thenReturn(Optional.of(huespedExistente));
        
        // Simular que el documento anterior es diferente al nuevo para forzar la validacioon
        when(huespedExistente.getDocumentacion()).thenReturn("11111111");
        when(huespedExistente.getTipoDocumento()).thenReturn(TipoDoc.DNI);
        
        //El documento nuevo NO existe en otro huesped
        when(huespedRepository.findByTipoDocumentoAndDocumentacion(any(), eq("99999999"))).thenReturn(Collections.emptyList());
        
        //La nueva dirección NO existe
        when(direccionRepository.findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
            anyString(), anyInt(), anyString(), anyString(), anyString(), anyString())).thenReturn(Optional.empty());
            
        // Mapper para crear la nueva Direccion y guardarla
        when(direccionMapper.crearEntidad(any(DireccionDTO.class))).thenReturn(nuevaDireccion);
        when(direccionRepository.save(nuevaDireccion)).thenReturn(nuevaDireccion);
        
        //Guardado final del Huesped
        when(huespedRepository.save(huespedExistente)).thenReturn(huespedExistente);
        when(huespedExistente.getDireccion()).thenReturn(nuevaDireccion); 
        when(huespedMapper.crearDTO(huespedExistente)).thenReturn(dtoActualizado); 

        HuespedDTO resultado = assertDoesNotThrow(() -> huespedService.actualizarHuesped(id, dtoActualizado));

        assertNotNull(resultado);
        verify(direccionRepository, times(1)).save(nuevaDireccion); 
        verify(huespedRepository, times(1)).save(huespedExistente);
        verify(huespedExistente, times(1)).setDocumentacion("99999999");
    }

    @Test
    @DisplayName("Debe actualizar huesped si el DNI no cambia, reutilizando la direccion existente")
    void actualizarHuesped_MismoDocumentoYDireccionExistente_ActualizaSinGuardarNuevaDireccion() {
        Long id = 1L;
        HuespedDTO dtoActualizado = crearHuespedDTO(true);
        dtoActualizado.setDocumentacion("12345678"); 
        
        Huesped huespedExistente = mock(Huesped.class);
        
        //El huesped a actualizar existe
        when(huespedRepository.findById(id)).thenReturn(Optional.of(huespedExistente));
        
        //Settear valores para que el check 'mismoDocumento' sea true
        when(huespedExistente.getDocumentacion()).thenReturn("12345678");
        when(huespedExistente.getTipoDocumento()).thenReturn(TipoDoc.DNI);
        
        //La direccion EXISTE y se reusa
        when(direccionRepository.findByNombreCalleAndNumCalleAndLocalidadAndCodPostalAndProvinciaAndPais(
            anyString(), anyInt(), anyString(), anyString(), anyString(), anyString())).thenReturn(Optional.of(DIRECCION_MOCK));
            
        //Guardado final
        when(huespedRepository.save(huespedExistente)).thenReturn(huespedExistente);
        when(huespedExistente.getDireccion()).thenReturn(DIRECCION_MOCK);
        when(huespedMapper.crearDTO(huespedExistente)).thenReturn(dtoActualizado); 

        assertDoesNotThrow(() -> huespedService.actualizarHuesped(id, dtoActualizado));
        verify(huespedRepository, never()).findByTipoDocumentoAndDocumentacion(any(), anyString()); // No debe buscar duplicados
        verify(huespedExistente, times(1)).setDireccion(DIRECCION_MOCK); 
        verify(direccionRepository, never()).save(any(Direccion.class)); 
    }


    @Test
    @DisplayName("Debe lanzar DocumentoUsadoException si el DNI es diferente y ya existe en otro huesped")
    void actualizarHuesped_DocumentoDuplicado_LanzaExcepcion() {
        Long idActual = 1L;
        HuespedDTO dtoActualizado = crearHuespedDTO(false);
        dtoActualizado.setDocumentacion("99999999"); 
        
        Huesped huespedExistente = mock(Huesped.class);
        Huesped huespedDuplicado = mock(Huesped.class); 
        
        //El huésped a actualizar existe
        when(huespedRepository.findById(idActual)).thenReturn(Optional.of(huespedExistente));
        
        //DNI existente: el existente actual tiene un DNI diferente
        when(huespedExistente.getDocumentacion()).thenReturn("11111111");
        when(huespedExistente.getTipoDocumento()).thenReturn(TipoDoc.DNI);
        
        //Se encuentra el documento nuevo ("99999999") asociado a otro ID
        when(huespedDuplicado.getId()).thenReturn(99L); 
        when(huespedRepository.findByTipoDocumentoAndDocumentacion(any(), eq("99999999")))
            .thenReturn(List.of(huespedDuplicado)); 
        when(huespedDuplicado.getTipoDocumento()).thenReturn(TipoDoc.DNI); // Necesario para construir la excepción

        assertThrows(DocumentoUsadoException.class, () -> huespedService.actualizarHuesped(idActual, dtoActualizado));

        verify(huespedRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe lanzar EntityNotFoundException si el huesped a actualizar no existe")
    void actualizarHuesped_HuespedNoExiste_LanzaExcepcion() {
        Long id = 99L;
        HuespedDTO dtoActualizado = crearHuespedDTO(false);
        
        when(huespedRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> huespedService.actualizarHuesped(id, dtoActualizado));

        verify(huespedRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe calcular la edad si se actualiza la fecha de nacimiento")
    void actualizarHuesped_ActualizaFechaNacimiento_CalculaEdad() {
        Long id = 1L;
        HuespedDTO dtoActualizado = crearHuespedDTO(false);
        dtoActualizado.setFechaNacimiento(LocalDate.of(2015, 1, 1)); 
        
        Huesped huespedExistente = mock(Huesped.class);
        
        when(huespedRepository.findById(id)).thenReturn(Optional.of(huespedExistente));
        // Simular que el documento no cambia para evitar la validacion DocumentoUsadoException
        when(huespedExistente.getDocumentacion()).thenReturn("12345678");
        when(huespedExistente.getTipoDocumento()).thenReturn(TipoDoc.DNI);
        
        when(huespedRepository.save(huespedExistente)).thenReturn(huespedExistente);
        when(huespedMapper.crearDTO(huespedExistente)).thenReturn(dtoActualizado);

        assertDoesNotThrow(() -> huespedService.actualizarHuesped(id, dtoActualizado));

        // Verificamos que se llamo a setEdad con algún valor (indicando que se calculo)
        verify(huespedExistente, times(1)).setEdad(anyInt()); 
    }

    // TESTS PARA: eliminarHuesped(Long id) 

    @Test
    @DisplayName("Debe eliminar un huesped si existe y no tiene estadias")
    void eliminarHuesped_HuespedExisteSinEstadias_DebeEliminar() {
        when(huespedRepository.existsById(HUESPED_ID)).thenReturn(true);
        when(estadiaRepository.existeHuespedEnEstadias(HUESPED_ID)).thenReturn(false);
        assertDoesNotThrow(() -> huespedService.eliminarHuesped(HUESPED_ID));
        verify(huespedRepository, times(1)).deleteById(HUESPED_ID);
    }

    @Test
    @DisplayName("Debe lanzar RuntimeException si el huesped no existe")
    void eliminarHuesped_HuespedNoExiste_DebeLanzarExcepcion() {
        when(huespedRepository.existsById(HUESPED_ID)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> huespedService.eliminarHuesped(HUESPED_ID));
        verify(huespedRepository, never()).deleteById(anyLong());     
    }

    @Test
    @DisplayName("Debe lanzar HuespedYaHospedadoException si tiene estadias registradas")
    void eliminarHuesped_HuespedConEstadias_DebeLanzarExcepcion() {
        when(huespedRepository.existsById(HUESPED_ID)).thenReturn(true);
        when(estadiaRepository.existeHuespedEnEstadias(HUESPED_ID)).thenReturn(true);
        assertThrows(HuespedYaHospedadoException.class, () -> huespedService.eliminarHuesped(HUESPED_ID));
        verify(huespedRepository, never()).deleteById(anyLong());
    }

    // TESTS PARA: actualizarCuitCondicionFiscal(Long id, DTO)
    
    @Test
    @DisplayName("Debe actualizar CUIT y Condicion Fiscal correctamente")
    void actualizarCuitCondicionFiscal_Valido_DebeGuardar() {
        ActualizarCuitCondicionFiscalDTO dto = new ActualizarCuitCondicionFiscalDTO();
        dto.setCuit("20-12345678-9");     
        dto.setCondicionFiscal(CondicionFiscal.CONSUMIDOR_FINAL);
        
        Mockito.lenient().when(HUESPED_MOCK_SAVE.getCuit()).thenReturn(null);
        
        when(huespedRepository.findById(HUESPED_ID)).thenReturn(Optional.of(HUESPED_MOCK_SAVE)); 

        assertDoesNotThrow(() -> huespedService.actualizarCuitCondicionFiscal(HUESPED_ID, dto));

        verify(huespedRepository, times(1)).save(HUESPED_MOCK_SAVE);
        verify(HUESPED_MOCK_SAVE, times(1)).setCuit("20123456789");     
        verify(HUESPED_MOCK_SAVE, times(1)).setCondicionFiscal(CondicionFiscal.CONSUMIDOR_FINAL);
    }

    @Test
    @DisplayName("Debe lanzar IllegalArgumentException si el huésped no existe")
    void actualizarCuitCondicionFiscal_HuespedInexistente_DebeLanzarExcepcion() {
        when(huespedRepository.findById(HUESPED_ID)).thenReturn(Optional.empty());
        ActualizarCuitCondicionFiscalDTO dto = new ActualizarCuitCondicionFiscalDTO();
        dto.setCuit("20123456789");     
        dto.setCondicionFiscal(CondicionFiscal.CONSUMIDOR_FINAL);

        assertThrows(IllegalArgumentException.class,     
            () -> huespedService.actualizarCuitCondicionFiscal(HUESPED_ID, dto));
        verify(huespedRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe lanzar IllegalArgumentException si el CUIT es nulo")
    void actualizarCuitCondicionFiscal_CuitNulo_DebeLanzarExcepcion() {
        when(huespedRepository.findById(HUESPED_ID)).thenReturn(Optional.of(HUESPED_MOCK_SAVE));
        ActualizarCuitCondicionFiscalDTO dto = new ActualizarCuitCondicionFiscalDTO();
        dto.setCuit(null);      

        assertThrows(IllegalArgumentException.class,     
            () -> huespedService.actualizarCuitCondicionFiscal(HUESPED_ID, dto));
        verify(huespedRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("Debe lanzar IllegalArgumentException si el CUIT no tiene 11 digitos")
    void actualizarCuitCondicionFiscal_CuitLargoInvalido_DebeLanzarExcepcion() {
        when(huespedRepository.findById(HUESPED_ID)).thenReturn(Optional.of(HUESPED_MOCK_SAVE));
        ActualizarCuitCondicionFiscalDTO dto = new ActualizarCuitCondicionFiscalDTO();
        dto.setCuit("123");     
        dto.setCondicionFiscal(CondicionFiscal.CONSUMIDOR_FINAL);

        assertThrows(IllegalArgumentException.class,     
            () -> huespedService.actualizarCuitCondicionFiscal(HUESPED_ID, dto));
        verify(huespedRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe lanzar IllegalArgumentException si la Condicion Fiscal es nula")
    void actualizarCuitCondicionFiscal_CondicionFiscalNula_DebeLanzarExcepcion() {
        when(huespedRepository.findById(HUESPED_ID)).thenReturn(Optional.of(HUESPED_MOCK_SAVE));
        ActualizarCuitCondicionFiscalDTO dto = new ActualizarCuitCondicionFiscalDTO();
        dto.setCuit("20123456789");     
        dto.setCondicionFiscal(null);       

        assertThrows(IllegalArgumentException.class,     
            () -> huespedService.actualizarCuitCondicionFiscal(HUESPED_ID, dto));
        verify(huespedRepository, never()).save(any());
    }
}