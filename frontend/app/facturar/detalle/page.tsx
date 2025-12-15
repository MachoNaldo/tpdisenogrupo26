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
  huespedPrincipal?: Huesped;
  acompanantes?: Huesped[];
  habitacion?: {
    numero?: number;
  };
};

type FacturableItem = {
  key: 'estadia' | 'consumos';
  label: string;
  amount?: number;
};


function mapTipoConsumidorToFactura(consumidorFinal: unknown): 'A' | 'B' | null {
  if (!consumidorFinal) return null;

  const v = String(consumidorFinal).trim().toUpperCase();


  if (v === 'A' || v === 'B') return v;


  if (v.includes('A')) return 'A';
  if (v.includes('B')) return 'B';

  return null;
}

export default function FacturarDetallePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const habitacionParam = searchParams.get('habitacion') ?? '';
  const fechaParam = searchParams.get('fecha') ?? '';
  const responsableParam = searchParams.get('responsable') ?? '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [estadia, setEstadia] = useState<EstadiaApi | null>(null);
  const [responsable, setResponsable] = useState<Huesped | null>(null);


  const [items] = useState<FacturableItem[]>([
    { key: 'estadia', label: 'Estadía' },
    { key: 'consumos', label: 'Consumos' },
  ]);

  const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>({
    estadia: true,
    consumos: true,
  });


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

      if (!habitacionParam || !fechaParam || !responsableParam) {
        setError('Faltan parámetros para facturar (habitacion, fecha o responsable).');
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams();
        params.append('habitacion', habitacionParam);
        params.append('fecha', fechaParam);

        const url = `${SPRING_BOOT_API_URL}/api/estadias/facturar/buscar?${params.toString()}`;

        const res = await fetch(url, { credentials: 'include' });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          const txt = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} - ${txt}`);
        }

        const data: EstadiaApi = await res.json();
        setEstadia(data);

        const lista: Huesped[] = [];
        if (data?.huespedPrincipal) lista.push(data.huespedPrincipal);
        if (Array.isArray(data?.acompanantes)) lista.push(...data.acompanantes);

        const responsableId = Number(responsableParam);
        const resp = lista.find((h) => h.id === responsableId) ?? null;

        if (!resp) {
          setError('No se pudo identificar el responsable seleccionado en la estadía.');
          setResponsable(null);
          return;
        }

        if (typeof resp.edad === 'number' && resp.edad < 18) {
          setError('La persona seleccionada es menor de edad, seleccione otra.');
          setResponsable(null);
          return;
        }

        setResponsable(resp);
      } catch (e) {
        console.error(e);
        setError('No se pudieron cargar los datos para facturar. Verifique los endpoints y los parámetros.');
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [habitacionParam, fechaParam, responsableParam, router]);

  const noches = useMemo(() => {
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



  const tipoFactura = useMemo<'A' | 'B' | null>(() => {
    const consumidorFinal = (responsable as any)?.consumidorFinal;
    return mapTipoConsumidorToFactura(consumidorFinal);
  }, [responsable]);

  // IVA y total final (solo si corresponde)
  const IVA_ALICUOTA = 0.21;
  const esFacturaA = tipoFactura === 'A';

  const montoIVA = useMemo(() => {
    if (!esFacturaA) return null;
    return subtotal * IVA_ALICUOTA;
  }, [esFacturaA, subtotal]);

  const totalFinal = useMemo(() => {
    return esFacturaA ? subtotal + (montoIVA ?? 0) : subtotal;
  }, [esFacturaA, subtotal, montoIVA]);

  const handleAceptar = async () => {
    if (!responsable || !estadia) {
      setError('No hay datos suficientes para generar la factura.');
      return;
    }

    
    if (!tipoFactura) {
      setError('No se pudo determinar si el responsable es Consumidor A o B. Verifique consumidorFinal.');
      return;
    }

    window.alert(
      'Paso 6 listo (UI). Para generar factura, falta implementar el endpoint de creación/previsualización de factura en backend.'
    );
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
              <strong>Fecha salida (seleccionada):</strong> {fechaParam}
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
              <strong>Estado:</strong> Pendiente de pago (al generar factura)
            </div>
          </div>
        </section>

        {/* Responsable */}
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

          {responsable ? (
            <div style={{ color: '#fff' }}>
              <div>
                <strong>Apellido y nombres:</strong> {responsable.apellido}, {responsable.nombres}
              </div>
              <div>
                <strong>Documento:</strong> {responsable.tipoDocumento} {responsable.documentacion}
              </div>
              <div>
                <strong>Edad:</strong> {responsable.edad}
              </div>

              {/* NUEVO: Consumidor A/B desde consumidorFinal */}
              <div>
                <strong>Condición (consumidorFinal):</strong>{' '}
                {tipoFactura ? `Consumidor ${tipoFactura}` : 'No informada / no mapeable'}
              </div>
            </div>
          ) : (
            <div style={{ color: '#fff' }}>No seleccionado.</div>
          )}
        </section>

        {/* Ítems a facturar (Paso 6) */}
        <section
          style={{
            border: '2px solid #b8975a',
            borderRadius: '8px',
            padding: '18px',
            marginBottom: '22px',
            background: 'rgba(0,0,0,0.35)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <h2 className="font-serif" style={{ color: '#b8975a', fontSize: '22px', marginBottom: '10px' }}>
              Ítems pendientes de facturar
            </h2>

            {/* REEMPLAZO: ya no hay selector; sale del responsable */}
            <div style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong>Tipo factura:</strong>
              <span style={{ border: '1px solid #b8975a', padding: '6px 10px', borderRadius: '6px' }}>
                {tipoFactura ?? 'N/D'}
              </span>
            </div>
          </div>

          <div style={{ color: '#fff', marginBottom: '10px' }}>
            Seleccione qué ítems desea incluir en la factura.
          </div>

          {/* TABLA SIN COLUMNA DETALLE */}
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

            {/* FOOTER: Subtotal / IVA / Total */}
            <tfoot>
              <tr style={{ color: '#fff' }}>
                <td style={tableCellStyle} />
                <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>Subtotal</td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}>$ {subtotal.toFixed(2)}</td>
              </tr>

              {/* FILA IVA: solo corresponde si A; además indica Consumidor A/B */}
              <tr style={{ color: '#fff' }}>
                <td style={tableCellStyle} />
                <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>
                  IVA (21%) {tipoFactura ? `- Consumidor ${tipoFactura}` : ''}
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                  {esFacturaA ? `$ ${(montoIVA ?? 0).toFixed(2)}` : 'N/A'}
                </td>
              </tr>

              <tr style={{ color: '#fff' }}>
                <td style={tableCellStyle} />
                <td style={{ ...tableCellStyle, fontWeight: 'bold' }}>Total</td>
                <td style={{ ...tableCellStyle, textAlign: 'right' }}>$ {totalFinal.toFixed(2)}</td>
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
