'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Huesped } from '../lib/tipos';


const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL;
const ENDPOINT_RDP_BUSCAR_POR_CUIT = '/api/responsablespago/buscar-por-cuit';
const ENDPOINT_RDP_CREAR = '/api/responsablespago/crear';

function cuitSoloDigitos(value: string): string {
  return (value ?? '').replace(/\D/g, '');
}

function esCuitValido11(value: string): boolean {
  return cuitSoloDigitos(value).length === 11;
}

export default function FacturarPage() {
  const [fecha, setFecha] = useState<string>('');
  const [numero, setNumero] = useState<string>('');
  const [resultados, setResultados] = useState<Huesped[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estadia, setEstadia] = useState<any | null>(null);
  const [listaHabitaciones, setListaHabitaciones] = useState<any[]>([]);
  const [mostrarGrilla, setMostrarGrilla] = useState(false);


  const [isListing, setIsListing] = useState(false);
  const [selectedHuespedId, setSelectedHuespedId] = useState<number | null>(null);

  const router = useRouter();


  const fechaRef = useRef<HTMLInputElement>(null);
  const numeroRef = useRef<HTMLInputElement>(null);

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
    //Buscamos todas las habitaciones que tenga el hotel
    fetch(`${SPRING_BOOT_API_URL}/api/habitaciones`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Error al cargar habitaciones');
      })
      .then((data) => setListaHabitaciones(data))
      .catch((err) => console.error(err));
  }, []);

  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();

    const erroresDetectados: string[] = [];
    let primerInputConError: HTMLInputElement | null = null;

    const fechaTrim = fecha?.trim();
    const numeroTrim = numero?.trim();
    if (!fechaTrim) {
      erroresDetectados.push('fecha faltante');
      if (!primerInputConError) primerInputConError = fechaRef.current;
    } else {
      const fechaIngresada = new Date(`${fechaTrim}T00:00:00`);
      if (Number.isNaN(fechaIngresada.getTime())) {
        erroresDetectados.push('fecha inválida');
        if (!primerInputConError) primerInputConError = fechaRef.current;
      }
    }

    if (!numeroTrim) {
      erroresDetectados.push('número de habitación faltante');
      if (!primerInputConError) primerInputConError = numeroRef.current;
    } else {
      try {
        const checkRes = await fetch(`${SPRING_BOOT_API_URL}/api/habitaciones/${numeroTrim}/existe`, {
          credentials: 'include',
        });

        if (!checkRes.ok) {
          setError('Error al verificar la habitación.');
          return;
        }

        const existe: boolean = await checkRes.json();

        if (!existe) {
          erroresDetectados.push(`la habitación ${numeroTrim} no existe`);
          if (!primerInputConError) primerInputConError = numeroRef.current;
        }
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar con el servidor para verificar la habitación.');
        return;
      }
    }

    if (erroresDetectados.length > 0) {
      setError(`Errores: ${erroresDetectados.join(', ')}.`);
      if (primerInputConError) primerInputConError.focus();
      return;
    }

    setLoading(true);
    setError(null);
    setResultados([]);
    setSelectedHuespedId(null);

    const params = new URLSearchParams();
    params.append('fecha', fechaTrim!);
    params.append('habitacion', numeroTrim!);

    const url = `${SPRING_BOOT_API_URL}/api/estadias/facturar/buscar?${params.toString()}`;

    try {
      const response = await fetch(url, { credentials: 'include' });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const dataEstadia = await response.json();
      setEstadia(dataEstadia);

      const listaUnificada: Huesped[] = [];
      if (dataEstadia?.huespedPrincipal) listaUnificada.push(dataEstadia.huespedPrincipal);
      if (Array.isArray(dataEstadia?.acompanantes)) listaUnificada.push(...dataEstadia.acompanantes);

      setResultados(listaUnificada);
      setIsListing(true);
    } catch (err) {
      console.error('Error al buscar Estadia:', err);
      setError(
        'No se encontro encontro Estadia'
      );
      //'Error al comunicarse con el servidor de búsqueda. Verifique que el endpoint /api/estadias/facturar/buscar esté activo.'
    } finally {
      setLoading(false);
    }
  };

  const handleSiguiente = async () => {
    if (!selectedHuespedId) {
      window.alert('Por favor, selecciona un huésped responsable de pago de la lista.');
      return;
    }

    const seleccionado = resultados.find((h) => h.id === selectedHuespedId);

    if (!seleccionado) {
      window.alert('No se pudo identificar el huésped seleccionado. Intente nuevamente.');
      return;
    }

    if (typeof seleccionado.edad === 'number' && seleccionado.edad < 18) {
      window.alert('La persona seleccionada es menor de edad, seleccione otra');
      return;
    }

    if (!SPRING_BOOT_API_URL) {
      window.alert('Error de configuración: NEXT_PUBLIC_API_URL no definido.');
      return;
    }

    const cuitDigits = cuitSoloDigitos((seleccionado as any).cuit);

    let responsablePagoId: number | null = null;

    if (cuitDigits && esCuitValido11(cuitDigits)) {
      try {
        const urlBuscar = `${SPRING_BOOT_API_URL}${ENDPOINT_RDP_BUSCAR_POR_CUIT}?cuit=${encodeURIComponent(cuitDigits)}`;
        const resBuscar = await fetch(urlBuscar, { credentials: 'include' });

        if (resBuscar.ok) {
          const rdp = await resBuscar.json();
          responsablePagoId = rdp?.id ?? null;
        } else if (resBuscar.status === 404) {
          const razonSocial = `${seleccionado.nombres ?? ''} ${seleccionado.apellido ?? ''}`.trim();

          const dtoCrear = {
            cuit: cuitDigits,
            razonSocial,
            direccion: (seleccionado as any).direccion ?? null,
            telefono: (seleccionado as any).telefono ?? '',
            nacionalidad: (seleccionado as any).nacionalidad ?? '',
          };

          const urlCrear = `${SPRING_BOOT_API_URL}${ENDPOINT_RDP_CREAR}`;

          const resCrear = await fetch(urlCrear, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dtoCrear),
            credentials: 'include',
          });

          if (!resCrear.ok) {
            const msg = await resCrear.text().catch(() => '');
            throw new Error(`No se pudo crear ResponsablePago. HTTP ${resCrear.status}. ${msg}`);
          }

          const creado = await resCrear.json();
          responsablePagoId = creado?.id ?? null;
        } else if (resBuscar.status === 401) {
          router.push('/login');
          return;
        } else {
          const txt = await resBuscar.text().catch(() => '');
          throw new Error(`Error buscando ResponsablePago. HTTP ${resBuscar.status}. ${txt}`);
        }
      } catch (err) {
        console.error(err);

        window.alert(
          'No se pudo resolver automáticamente el Responsable de Pago para este huésped.\n' +
          'Puede facturar a nombre de un tercero o dar de alta el Responsable de Pago manualmente.'
        );
        return;
      }
    } else {
      window.alert(
        'El huésped seleccionado no tiene CUIT válido. Para continuar, facture a nombre de un tercero o registre un Responsable de Pago.'
      );
      return;
    }

    if (!responsablePagoId) {
      window.alert('No se pudo determinar el Responsable de Pago (ID inválido). Intente nuevamente o use el flujo de tercero.');
      return;
    }

    router.push(
      `/facturar/detalle?habitacion=${encodeURIComponent(numero)}&fecha=${encodeURIComponent(
        fecha
      )}&responsable=${encodeURIComponent(String(selectedHuespedId))}&responsablePagoId=${encodeURIComponent(
        String(responsablePagoId)
      )}`
    );
  };

  const handleCancelar = () => {
    router.push('/menu');
  };

  const renderHeader = () => (
    <header className="ui-header">
      <h1 className="ui-header-title">Elegir responsable de pago</h1>
      <div className="ui-header-right">
        <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="ui-header-logo" />
      </div>
    </header>
  );

  // VISTA 1: CRITERIOS (habitacion + fecha)
  if (!isListing) {
    return (
      <main className="ui-hero">
        <div className="ui-hero-bg" />
        <div className="ui-hero-overlay-65" />

        <div className="ui-hero-card">
          <h1 className="ui-hero-title">Generar Factura</h1>

          {error && (<div className="error-box">
            <div className="error-icon">
              <Image src="img/iconoError.svg" alt="icono" width={40} height={40} />
            </div>
            <p className="error-text">
              {error}
            </p>
          </div>
          )}





          <form className="form" onSubmit={handleBuscar}>
            <div className="ui-input-group-wrapper">

              <div className="ui-input-with-action">
                <input
                  ref={numeroRef}
                  type="number"
                  min="1"
                  placeholder="Número de Habitación"
                  value={numero}
                  className="ui-input-field" // Asegúrate de tener estilos para tu input si no los tenías
                  onChange={(e) => {
                    setNumero(e.target.value);
                    setError(null);
                  }}
                  // Opcional: Cerrar la grilla si el usuario empieza a escribir
                  onFocus={() => setMostrarGrilla(false)}
                />

                {/* Botón para desplegar la grilla */}
                <button
                  type="button"
                  className="ui-btn-icon"
                  onClick={() => setMostrarGrilla(!mostrarGrilla)}
                  title="Ver lista de habitaciones"
                >
                  {/* Icono simple de lista/flecha (puedes usar una imagen o svg) */}
                  ▼
                </button>
              </div>

              {/* LA GRILLA FLOTANTE (Solo se muestra si mostrarGrilla es true) */}
              {mostrarGrilla && (
                <div className="ui-grid-popover">
                  {listaHabitaciones.length > 0 ? (
                    listaHabitaciones.map((num) => (
                      <button
                        key={num}
                        type="button"
                        className="ui-grid-item"
                        onClick={() => {
                          setNumero(String(num)); // Selecciona el número
                          setMostrarGrilla(false); // Cierra el menú
                          setError(null);
                        }}
                      >
                        {num}
                      </button>
                    ))
                  ) : (
                    <div style={{ padding: '10px', color: '#888' }}>Cargando...</div>
                  )}
                </div>
              )}

            {/* Fecha de salida */}
            <div>
              <input
                ref={fechaRef}
                type="date"
                className="ui-input-date"
                value={fecha}
                onChange={(e) => {
                  setFecha(e.target.value);
                  setError(null);
                }}
              />
            </div>
        </div>

        <div className="ui-actions-center">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>

          <button type="button" onClick={handleCancelar} className="btn">
            Cancelar
          </button>
        </div>
      </form>
        </div >
      </main >
    );
  }

  // --- VISTA 2: LISTADO ---
  return (
    <div className="ui-page">
      {renderHeader()}

      <main className="ui-container-lg">
        <table className="ui-table">
          <thead className="ui-table-head">
            <tr>
              <th>Apellido</th>
              <th>Nombres</th>
              <th>Tipo de doc</th>
              <th>Documento</th>
              <th>Edad</th>
            </tr>
          </thead>

          <tbody>
            {resultados.map((huesped) => {
              const selected = selectedHuespedId === huesped.id;
              return (
                <tr
                  key={huesped.id ?? huesped.documentacion}
                  className={`ui-table-row ${selected ? 'ui-table-row--selected' : ''}`}
                  onClick={() => setSelectedHuespedId(huesped.id ?? null)}
                >
                  <td className="ui-table-cell">{huesped.apellido}</td>
                  <td className="ui-table-cell">{huesped.nombres}</td>
                  <td className="ui-table-cell">{huesped.tipoDocumento}</td>
                  <td className="ui-table-cell">{huesped.documentacion}</td>
                  <td className="ui-table-cell">{huesped.edad} año/s</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="ui-actions-end" style={{ justifyContent: 'space-between' }}>
          <button
            className="btn"
            type="button"
            onClick={() => {
              router.push(`/facturar/tercero?habitacion=${encodeURIComponent(numero)}&fecha=${encodeURIComponent(fecha)}`);
            }}
          >
            Facturar a nombre de un Tercero
          </button>

          <div style={{ display: 'flex', gap: '30px' }}>
            <button className="btn" type="button" onClick={handleSiguiente}>
              Siguiente
            </button>
            <button className="btn" type="button" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
