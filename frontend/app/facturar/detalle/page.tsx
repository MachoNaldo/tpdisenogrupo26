'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Huesped } from '../../lib/tipos';
import '../../styles/estilos.css';

const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL;

type EstadiaApi = {
  id?: number;
  fechaCheckIn?: string;
  fechaCheckOut?: string;
  cantidadNoches?: number;
  precioTotal?: number;
  huespedPrincipal?: Huesped;
  acompanantes?: Huesped[];
  habitacion?: {
    numero?: number;
    tipo?: string;
    precioPorNoche?: number;
  };
};

type PersonaData = {
  id: number;
  cuit: string | null;
  razonSocial: string;
  telefono: string;
  nacionalidad: string;
  tipoDocumento?: string;
  documentacion?: string;
};

type FacturableItem = {
  key: 'estadia' | 'consumos';
  label: string;
  amount?: number;
};

export default function FacturarDetallePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const habitacionParam = searchParams.get('habitacion') ?? '';
  const fechaParam = searchParams.get('fecha') ?? '';
  const personaIdParam = searchParams.get('personaId') ?? ''; 
  
  // Datos de la persona que vienen de la página anterior
  const cuitParam = searchParams.get('cuit') ?? '';
  const razonSocialParam = searchParams.get('razonSocial') ?? '';
  const telefonoParam = searchParams.get('telefono') ?? '';
  const nacionalidadParam = searchParams.get('nacionalidad') ?? '';
  const tipoDocumentoParam = searchParams.get('tipoDocumento') ?? '';
  const documentacionParam = searchParams.get('documentacion') ?? '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [estadia, setEstadia] = useState<EstadiaApi | null>(null);

  const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>({
    estadia: true,
    consumos: true,
  });

  // Construir el objeto persona desde los parámetros
  const persona = useMemo<PersonaData | null>(() => {
    if (!personaIdParam) return null;
    
    return {
      id: Number(personaIdParam),
      cuit: cuitParam || null,
      razonSocial: razonSocialParam,
      telefono: telefonoParam,
      nacionalidad: nacionalidadParam,
      tipoDocumento: tipoDocumentoParam,
      documentacion: documentacionParam,
    };
  }, [personaIdParam, cuitParam, razonSocialParam, telefonoParam, nacionalidadParam, tipoDocumentoParam, documentacionParam]);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch(`${SPRING_BOOT_API_URL}/revisar-sesion`, {
          credentials: 'include',
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        if (!data.autenticado) {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      }
    };

    verificarSesion();
  }, [router]);

  useEffect(() => {
    const cargar = async () => {
      setError(null);

      // Validar parámetros mínimos
      if (!habitacionParam || !fechaParam || !personaIdParam) {
        setError('Faltan parámetros para facturar (habitacion, fecha o personaId).');
        return;
      }

      setLoading(true);

      try {
        // Cargar estadía
        const params = new URLSearchParams();
        params.append('habitacion', habitacionParam);
        params.append('fecha', fechaParam);

        const urlEstadia = `${SPRING_BOOT_API_URL}/api/estadias/facturar/buscar?${params.toString()}`;
        const resEstadia = await fetch(urlEstadia, { credentials: 'include' });

        if (!resEstadia.ok) {
          if (resEstadia.status === 401) {
            router.push('/login');
            return;
          }
          const txt = await resEstadia.text().catch(() => '');
          throw new Error(`HTTP ${resEstadia.status} - ${txt}`);
        }

        const dataEstadia: EstadiaApi = await resEstadia.json();
        setEstadia(dataEstadia);
        
        console.log("=== ESTADÍA CARGADA ===");
        console.log("Estadia completa:", dataEstadia);
        console.log("Estadia ID:", dataEstadia.id);
        console.log("=======================");

      } catch (e) {
        console.error(e);
        setError('No se pudieron cargar los datos para facturar. Verifique los endpoints.');
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [habitacionParam, fechaParam, personaIdParam, router]);

  const noches = useMemo(() => {
    // Si el backend ya envía cantidadNoches, usarlo directamente
    if (estadia?.cantidadNoches !== undefined) {
      return estadia.cantidadNoches;
    }
    
    // Fallback: calcular desde las fechas (por si acaso)
    const inStr = estadia?.fechaCheckIn;
    const outStr = estadia?.fechaCheckOut;
    if (!inStr || !outStr) return null;

    const inD = new Date(`${inStr}T00:00:00`);
    const outD = new Date(`${outStr}T00:00:00`);
    if (Number.isNaN(inD.getTime()) || Number.isNaN(outD.getTime())) return null;

    const diff = outD.getTime() - inD.getTime();
    const days = Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
    return days;
  }, [estadia]);

  const precioEstadia = useMemo(() => {
    if (estadia?.precioTotal !== undefined) {
      return estadia.precioTotal;
    }
    
    if (!noches || noches === 0) return null;
    const precioPorNoche = estadia?.habitacion?.precioPorNoche;
    if (typeof precioPorNoche !== 'number') return null;
    return noches * precioPorNoche;
  }, [noches, estadia]);

  const items = useMemo<FacturableItem[]>(() => {
    return [
      { key: 'estadia', label: 'Estadía', amount: precioEstadia ?? undefined },
      { key: 'consumos', label: 'Consumos', amount: 0 }, // TODO: cargar consumos reales
    ];
  }, [precioEstadia]);

  const handleToggleItem = (key: FacturableItem['key']) => {
    setSelectedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => {
      if (!selectedKeys[it.key]) return acc;
      if (typeof it.amount !== 'number') return acc;
      return acc + it.amount;
    }, 0);
  }, [items, selectedKeys]);

  // Determinar tipo de factura según tenga o no CUIT válido
  const tipoFactura = useMemo<'A' | 'B'>(() => {
    const cuit = persona?.cuit;
    const cuitLimpio = cuit?.replace(/\D/g, '') ?? '';
    return cuitLimpio.length === 11 ? 'A' : 'B';
  }, [persona]);

  const esFacturaA = tipoFactura === 'A';

  // IVA y total final
  const IVA_ALICUOTA = 0.21;

  const montoIVA = useMemo(() => {
    if (!esFacturaA) return null;
    return subtotal * IVA_ALICUOTA;
  }, [esFacturaA, subtotal]);

  const totalFinal = useMemo(() => {
    return esFacturaA ? subtotal + (montoIVA ?? 0) : subtotal;
  }, [esFacturaA, subtotal, montoIVA]);

  const handleAceptar = async () => {
    if (!persona || !estadia) {
      setError('No hay datos suficientes para generar la factura.');
      return;
    }

    if (!SPRING_BOOT_API_URL) {
      setError('Error de configuración: NEXT_PUBLIC_API_URL no definido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Preparar request - solo IDs y flags, el backend calcula el resto
      const requestBody = {
        estadiaId: estadia.id,
        personaId: persona.id,
        incluirEstadia: selectedKeys.estadia,
        incluirConsumos: selectedKeys.consumos,
      };

      console.log("=== ENVIANDO FACTURA ===");
      console.log("Request body:", requestBody);
      console.log("========================");

      const response = await fetch(`${SPRING_BOOT_API_URL}/api/facturas/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        const errorText = await response.text().catch(() => '');
        throw new Error(`Error HTTP ${response.status}: ${errorText}`);
      }

      const facturaCreada = await response.json();

      // Mostrar confirmación
      window.alert(
        `✓ Factura generada exitosamente\n\n` +
        `Número: ${facturaCreada.numero}\n` +
        `Tipo: ${facturaCreada.tipoFactura}\n` +
        `Responsable: ${facturaCreada.responsablePago.razonSocial}\n` +
        `Total: ${facturaCreada.importeTotal.toFixed(2)}\n` +
        `Estado: ${facturaCreada.estado}`
      );

      // Redirigir al menú o a una página de factura
      router.push('/menu');

    } catch (err) {
      console.error('Error al crear factura:', err);
      setError(
        err instanceof Error 
          ? `Error al generar la factura: ${err.message}` 
          : 'Error desconocido al generar la factura'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    router.push('/menu');
  };

  const renderHeader = () => (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#000',
        borderBottom: '2px solid #b8975a',
      }}
    >
      <h1
        className="font-serif"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '42px',
          fontStyle: 'italic',
          color: '#b8975a',
        }}
      >
        Facturar
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="opacity-45" />
      </div>
    </header>
  );

  return (
    <div className="estilo1">
      {renderHeader()}

      <main style={{ maxWidth: '980px', margin: '40px auto', padding: '0 16px' }}>
        {loading && (
          <div className="text-white" style={{ marginBottom: '16px' }}>
            Cargando datos de facturación...
          </div>
        )}

        {error && (
          <div className="text-red-400 mb-5 text-sm border border-red-400 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Resumen de estadía */}
        <section
          style={{
            border: '2px solid #b8975a',
            borderRadius: '8px',
            padding: '18px',
            marginBottom: '22px',
            background: 'rgba(0,0,0,0.35)',
          }}
        >
          <h2 className="font-serif" style={{ color: '#b8975a', fontSize: '22px', marginBottom: '10px' }}>
            Datos de estadía
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#fff' }}>
            <div>
              <strong>Habitación:</strong> {habitacionParam}
            </div>
            <div>
              <strong>Tipo:</strong> {estadia?.habitacion?.tipo ?? 'N/D'}
            </div>
            <div>
              <strong>Fecha salida (seleccionada):</strong> {fechaParam}
            </div>
            <div>
              <strong>Precio por noche:</strong> ${estadia?.habitacion?.precioPorNoche?.toFixed(2) ?? 'N/D'}
            </div>
            <div>
              <strong>Check-in:</strong> {estadia?.fechaCheckIn ?? 'N/D'}
            </div>
            <div>
              <strong>Check-out (para facturar):</strong> {estadia?.fechaCheckOut ?? 'N/D'}
            </div>
            <div>
              <strong>Noches:</strong> {noches ?? 'N/D'}
            </div>
            <div>
              <strong>Subtotal estadía:</strong> ${precioEstadia?.toFixed(2) ?? 'N/D'}
            </div>
            <div>
              <strong>Estado:</strong> Pendiente de pago
            </div>
          </div>
        </section>

        {/* Responsable de pago */}
        <section
          style={{
            border: '2px solid #b8975a',
            borderRadius: '8px',
            padding: '18px',
            marginBottom: '22px',
            background: 'rgba(0,0,0,0.35)',
          }}
        >
          <h2 className="font-serif" style={{ color: '#b8975a', fontSize: '22px', marginBottom: '10px' }}>
            Responsable de pago
          </h2>

          {persona ? (
            <div style={{ color: '#fff', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <strong>Razón Social:</strong> {persona.razonSocial}
              </div>

              <div>
                <strong>Tipo de Factura:</strong> {tipoFactura}
              </div>

              {/* FACTURA A: Mostrar CUIT */}
              {esFacturaA && (
                <div>
                  <strong>CUIT:</strong> {persona.cuit}
                </div>
              )}

              {/* FACTURA B: Mostrar documentación */}
              {!esFacturaA && persona.tipoDocumento && persona.documentacion && (
                <>
                  <div>
                    <strong>Tipo Documento:</strong> {persona.tipoDocumento}
                  </div>
                  <div>
                    <strong>Documento:</strong> {persona.documentacion}
                  </div>
                </>
              )}

              {persona.telefono && (
                <div>
                  <strong>Teléfono:</strong> {persona.telefono}
                </div>
              )}

              {persona.nacionalidad && (
                <div>
                  <strong>Nacionalidad:</strong> {persona.nacionalidad}
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#fff' }}>No seleccionado.</div>
          )}
        </section>

        {/* Ítems a facturar */}
        <section
          style={{
            border: '2px solid #b8975a',
            borderRadius: '8px',
            padding: '18px',
            marginBottom: '22px',
            background: 'rgba(0,0,0,0.35)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 className="font-serif" style={{ color: '#b8975a', fontSize: '22px', margin: 0 }}>
              Ítems pendientes de facturar
            </h2>

            <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>Tipo factura:</strong>
              <span style={{ border: '1px solid #b8975a', padding: '6px 10px', borderRadius: '6px' }}>
                {tipoFactura}
              </span>
            </div>
          </div>

          <div style={{ color: '#fff', marginBottom: '10px' }}>
            Seleccione qué ítems desea incluir en la factura.
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #b8975a' }}>
            <thead>
              <tr style={{ backgroundColor: '#b8975a', color: '#000' }}>
                <th className="w-0" style={tableHeaderStyle}></th>
                <th style={tableHeaderStyle}>Concepto</th>
                <th style={tableHeaderStyle}>Importe</th>
              </tr>
            </thead>

            <tbody>
              {items.map((it) => (
                <tr key={it.key} style={{ color: '#fff' }}>
                  <td style={tableCellStyle}>
                    <input
                      type="checkbox"
                      checked={!!selectedKeys[it.key]}
                      onChange={() => handleToggleItem(it.key)}
                    />
                  </td>

                  <td style={tableCellStyle}>{it.label}</td>

                  <td style={tableCellStyle}>
                    {typeof it.amount === 'number' ? `$ ${it.amount.toFixed(2)}` : 'N/D'}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr style={{ color: '#fff' }}>
                <td style={tableCellStyle} />
                <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>Subtotal</td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}>$ {subtotal.toFixed(2)}</td>
              </tr>

              {/* Fila IVA */}
              <tr style={{ color: '#fff' }}>
                <td style={tableCellStyle} />
                <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>
                  {esFacturaA ? 'IVA (21%)' : 'IVA (incluido)'}
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                  {esFacturaA ? `$ ${(montoIVA ?? 0).toFixed(2)}` : 'N/A'}
                </td>
              </tr>

              <tr style={{ color: '#fff', backgroundColor: 'rgba(184, 151, 90, 0.2)' }}>
                <td style={tableCellStyle} />
                <td style={{ ...tableCellStyle, fontWeight: 'bold', fontSize: '18px' }}>Total</td>
                <td style={{ ...tableCellStyle, textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
                  $ {totalFinal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '18px', marginTop: '18px' }}>
          <button className="btn" type="button" onClick={handleAceptar} disabled={loading}>
            Aceptar
          </button>
          <button className="btn" type="button" onClick={handleCancelar} disabled={loading}>
            Cancelar
          </button>
        </div>
      </main>
    </div>
  );
}

// Estilos de tabla
const tableHeaderStyle: React.CSSProperties = {
  padding: '12px',
  border: '1px solid #000',
  textAlign: 'left',
};

const tableCellStyle: React.CSSProperties = {
  padding: '10px',
  border: '1px solid #b8975a',
  color: 'inherit',
};