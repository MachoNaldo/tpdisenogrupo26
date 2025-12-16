package grupo26diseno.tpdisenogrupo26.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.persistence.EntityNotFoundException;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;
import grupo26diseno.tpdisenogrupo26.dtos.*;
import grupo26diseno.tpdisenogrupo26.model.*;
import grupo26diseno.tpdisenogrupo26.repository.*;
import grupo26diseno.tpdisenogrupo26.service.CalculadoraFiscalStrategy.CalculadoraFactory;
import grupo26diseno.tpdisenogrupo26.service.CalculadoraFiscalStrategy.CalculadoraFiscalStrategy;
import grupo26diseno.tpdisenogrupo26.service.CalculadoraFiscalStrategy.ResultadoCalculo;
import grupo26diseno.tpdisenogrupo26.mapper.FacturaMapper;

@Service
public class FacturaServiceImpl implements FacturaService {

    private static final double IVA = 0.21;

    @Autowired
    private FacturaRepository facturaRepository;
    @Autowired
    private EstadiaRepository estadiaRepository;
    @Autowired
    private PersonaRepository personaRepository;
    @Autowired
    private FacturaMapper facturaMapper;
    @Autowired
    private CalculadoraFactory calculadoraFactory;

    @Override
    @Transactional
    public FacturaDTO crearFactura(CrearFacturaRequest request) {
        System.out.println("REQUEST RECIBIDO: " + request); 
    System.out.println("ID Estadia: " + request.getEstadiaId());
    System.out.println("ID Responsable: " + request.getPersonaId());
        Estadia estadia = estadiaRepository.findById(request.getEstadiaId()).orElseThrow();
        Persona persona = personaRepository.findById(request.getPersonaId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "No se encontró la persona con ID: " + request.getPersonaId()));

        double subtotalNeto = 0.0;
        List<FacturaDTO.DetalleFacturaDTO> detalles = new ArrayList<>();

        if (request.getIncluirEstadia()) {
            double precioBase = estadia.getHabitacion().getTipo().getPrecioBase();
            long noches = ChronoUnit.DAYS.between(estadia.getFechaCheckIn(), estadia.getFechaCheckOut());

            subtotalNeto = noches * precioBase;

            FacturaDTO.DetalleFacturaDTO detalleEstadia = new FacturaDTO.DetalleFacturaDTO();
            detalleEstadia.setConcepto("Estadía - Habitación " + estadia.getHabitacion().getNumero());
            detalleEstadia.setCantidad((int) noches);
            detalleEstadia.setPrecioUnitario(precioBase);
            detalleEstadia.setSubtotal(subtotalNeto);
            detalles.add(detalleEstadia);
        }

        // Calcular consumos si corresponde
        if (request.getIncluirConsumos()) {
        }

        CalculadoraFiscalStrategy estrategia = calculadoraFactory.obtenerEstrategia(persona);
        ResultadoCalculo resultado = estrategia.calcular(subtotalNeto);

        // Crear factura
        Factura factura = new Factura();
        factura.setImporteNeto(resultado.getNeto());
        factura.setIva(resultado.getIva());
        factura.setImporteTotal(resultado.getTotal());
        factura.setTipo(resultado.getLetraFactura());
        factura.setResponsable(persona);
        factura.setEstadia(estadia);
        factura.setFechaConfeccion(java.sql.Date.valueOf(LocalDate.now()));
        factura.setEstado(EstadoFactura.Pendiente);
        factura.setNumero(generarNumeroFactura());

        Factura guardada = facturaRepository.save(factura);

        FacturaDTO facturaDTO = facturaMapper.crearDTO(guardada);

        facturaDTO.setDetalles(detalles);

        return facturaDTO;
    }

    private int generarNumeroFactura() {
        Integer ultimoNumero = facturaRepository.buscarNumeroFactura();
        return (ultimoNumero != null ? ultimoNumero : 0) + 1;
    }

    @Override
    @Transactional(readOnly = true)
    public FacturaDTO obtenerFactura(Long id) {
        Factura factura = facturaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Factura no encontrada"));
        return facturaMapper.crearDTO(factura);
    }
}