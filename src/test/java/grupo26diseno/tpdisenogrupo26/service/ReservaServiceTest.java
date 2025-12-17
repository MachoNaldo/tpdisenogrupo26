package grupo26diseno.tpdisenogrupo26.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyString;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import grupo26diseno.tpdisenogrupo26.dtos.ReservaDTO;
import grupo26diseno.tpdisenogrupo26.mapper.ReservaMapper;
import grupo26diseno.tpdisenogrupo26.model.Habitacion;
import grupo26diseno.tpdisenogrupo26.model.Reserva;
import grupo26diseno.tpdisenogrupo26.repository.PeriodoRepository;
import grupo26diseno.tpdisenogrupo26.repository.ReservaRepository;

@ExtendWith(MockitoExtension.class)
public class ReservaServiceTest {
    
    @Mock 
    private ReservaRepository reservaRepository; 
    
    @Mock 
    private PeriodoRepository periodoRepository; 

    @Mock
    private ReservaMapper reservaMapper;
    
    @InjectMocks 
    private ReservaServiceImpl reservaService; 

    private final Long RESERVA_ID = 1L;

    // TESTS PARA: obtenerReservasPorHabitacionYFecha(long, LocalDate, LocalDate)

    @Test
    @DisplayName("Debe obtener reservas por habitación y rango de fechas y mapear a DTO con estructura anidada")
    void obtenerReservasPorHabitacionYFecha_ReservasExistentes_RetornaDTOConDatosAnidados() {
        // ARRANGE
        long numeroHabitacion = 101L;
        LocalDate fechaInicio = LocalDate.of(2025, 1, 1);
        LocalDate fechaFin = LocalDate.of(2025, 1, 10);

        // Mocks para la Reserva y Habitacion
        Reserva reservaMock = mock(Reserva.class);
        Habitacion habitacionMock = mock(Habitacion.class);

        // Stubbing de la Entidad Reserva para la logica del stream
        when(reservaMock.getHabitacion()).thenReturn(habitacionMock);
        when(habitacionMock.getNumero()).thenReturn(numeroHabitacion);
        
        when(reservaMock.getNombreReservador()).thenReturn("Fabiano");
        when(reservaMock.getApellidoReservador()).thenReturn("Caruana");
        when(reservaMock.getTelefonoReservador()).thenReturn("123456789");
        when(reservaMock.getFechaInicio()).thenReturn(LocalDate.of(2025, 1, 3));
        when(reservaMock.getFechaFinal()).thenReturn(LocalDate.of(2025, 1, 7));

        List<Reserva> reservas = List.of(reservaMock);

        when(reservaRepository.findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
            eq(numeroHabitacion), eq(fechaFin), eq(fechaInicio)))
            .thenReturn(reservas);

        List<ReservaDTO> resultado = reservaService.obtenerReservasPorHabitacionYFecha(
            numeroHabitacion, fechaInicio, fechaFin);

        assertNotNull(resultado);
        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());

        ReservaDTO dto = resultado.get(0);
        
        assertNotNull(dto.getCliente());
        assertEquals("Fabiano", dto.getCliente().getNombre(), "Debe obtener el nombre de quienn reservo (getNombre)"); 
        assertEquals("Caruana", dto.getCliente().getApellido(), "Debe obtener el apellido del que hizo la reserva (getApellido)");
        assertEquals("123456789", dto.getCliente().getTelefono(), "Debe obtener el telefono (getTelefono)");

        assertNotNull(dto.getReservas());
        assertEquals(1, dto.getReservas().size());
        assertEquals(numeroHabitacion, dto.getReservas().get(0).getNumeroHabitacion());
        assertEquals("2025-01-03", dto.getReservas().get(0).getFechaInicio());
        assertEquals("2025-01-07", dto.getReservas().get(0).getFechaFin());
        


        verify(reservaRepository, times(1)).findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
            numeroHabitacion, fechaFin, fechaInicio);
    }
    
    @Test
    @DisplayName("Debe retornar una lista vacia si no hay reservas que coincidan")
    void obtenerReservasPorHabitacionYFecha_NoReservasExistentes_RetornaListaVacia() {
        long numeroHabitacion = 101L;
        LocalDate fechaInicio = LocalDate.of(2025, 1, 1);
        LocalDate fechaFin = LocalDate.of(2025, 1, 10);

        when(reservaRepository.findByHabitacionNumeroAndFechaInicioLessThanEqualAndFechaFinalGreaterThanEqual(
            eq(numeroHabitacion), eq(fechaFin), eq(fechaInicio)))
            .thenReturn(List.of());
        List<ReservaDTO> resultado = reservaService.obtenerReservasPorHabitacionYFecha(
            numeroHabitacion, fechaInicio, fechaFin);
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
    }

    // TESTS PARA: buscarReservaPorCriterios(String apellido, String nombres)
    @Test
    @DisplayName("Debe buscar reservas por apellido y nombre y mapear a DTOs")
    void buscarReservaPorCriterios_CriteriosValidos_RetornaListaDTO() {
        Reserva reservaMock = new Reserva();
        ReservaDTO reservaDTOMock = new ReservaDTO();
        List<Reserva> reservas = List.of(reservaMock);
        
        when(reservaRepository.buscarPorCriterios(eq("Roca"), eq("Julio"))).thenReturn(reservas);
        when(reservaMapper.crearDTO(reservaMock)).thenReturn(reservaDTOMock);
        List<ReservaDTO> resultado = reservaService.buscarReservaPorCriterios("Roca", "Julio");


        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(reservaDTOMock, resultado.get(0));
        verify(reservaRepository, times(1)).buscarPorCriterios("Roca", "Julio");
        verify(reservaMapper, times(1)).crearDTO(reservaMock);
    }

    @Test
    @DisplayName("Debe retornar lista vacia si la busqueda por criterios no arroja resultados")
    void buscarReservaPorCriterios_NoResultados_RetornaListaVacia() {
        when(reservaRepository.buscarPorCriterios(anyString(), anyString())).thenReturn(List.of());

        List<ReservaDTO> resultado = reservaService.buscarReservaPorCriterios("NoExiste", "Nadie");
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
        verify(reservaMapper, never()).crearDTO(any());
    }

    // TESTS PARA: cancelarReserva(Long idReserva)

    @Test 
    @DisplayName("Debe eliminar la reserva si existe")
    public void cancelarReserva_ReservaExistente_DebeEliminarYNoLanzarExcepcion() {
        Long idExistente = RESERVA_ID;
        Reserva reservaExistente = new Reserva(); 
        reservaExistente.setId(idExistente);

        when(reservaRepository.findById(idExistente)).thenReturn(Optional.of(reservaExistente));
        assertDoesNotThrow(() -> reservaService.cancelarReserva(idExistente));
        verify(reservaRepository, times(1)).findById(idExistente);
        verify(reservaRepository, times(1)).delete(reservaExistente);
    }

    @Test 
    @DisplayName("Debe lanzar RuntimeException si la reserva no existe")
    public void cancelarReserva_ReservaNoExistente_DebeLanzarRuntimeException() {
        Long idNoExistente = 99L;
        
        when(reservaRepository.findById(idNoExistente)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> {
            reservaService.cancelarReserva(idNoExistente);
        }, "Debe lanzar RuntimeException si la reserva no se encuentra.");
        
        verify(reservaRepository, never()).delete(any(Reserva.class));
    }
}