'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Huesped } from '../lib/tipos';
import ModalCuit from './ModalCuit';

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

  const [mostrarModalCuit, setMostrarModalCuit] = useState(false);
  
  const [mostrarModalOpciones, setMostrarModalOpciones] = useState(false);

  const [debeReintentarSiguiente, setDebeReintentarSiguiente] = useState(false);

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
    fetch(`${SPRING_BOOT_API_URL}/api/habitaciones`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Error al cargar habitaciones');
      })
      .then((data) => setListaHabitaciones(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (debeReintentarSiguiente) {
      setDebeReintentarSiguiente(false);
      handleSiguiente();
    }
  }, [debeReintentarSiguiente, resultados]);

  const handleCuitActualizado = (cuit: string, condicionFiscal: string) => {
    setResultados(prev => prev.map(h =>
      h.id === selectedHuespedId
        ? { ...h, cuit, condicionFiscal } as any
        : h
    ));
    setMostrarModalCuit(false);
    setDebeReintentarSiguiente(true);
  };

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
      setError('No se encontro encontro Estadia');
    } finally {
      setLoading(false);
    }
  };


  const procesarResponsablePago = async (huesped: Huesped, cuitAUsar: string) => {
    if (!SPRING_BOOT_API_URL) {
      window.alert('Error de configuración: NEXT_PUBLIC_API_URL no definido.');
      return;
    }

    let responsablePagoId: number | null = null;
    const cuitLimpio = cuitSoloDigitos(cuitAUsar);

    try {
      const urlBuscar = `${SPRING_BOOT_API_URL}${ENDPOINT_RDP_BUSCAR_POR_CUIT}?cuit=${encodeURIComponent(cuitLimpio)}`;
      const resBuscar = await fetch(urlBuscar, { credentials: 'include' });

      if (resBuscar.ok) {
        const rdp = await resBuscar.json();
        responsablePagoId = rdp?.id ?? null;
      } 
      else if (resBuscar.status === 404) {
        const razonSocial = `${huesped.nombres ?? ''} ${huesped.apellido ?? ''}`.trim();
        const dtoCrear = {
          cuit: cuitLimpio,
          razonSocial,
          direccion: (huesped as any).direccion ?? null,
          telefono: (huesped as any).telefono ?? '',
          nacionalidad: (huesped as any).nacionalidad ?? '',
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
      } 
      else if (resBuscar.status === 401) {
        router.push('/login');
        return;
      } 
      else {
        throw new Error(`Error buscando ResponsablePago.`);
      }

      if (!responsablePagoId) {
        window.alert('No se pudo determinar el ID del Responsable de Pago.');
        return;
      }

      router.push(
        `/facturar/detalle?` +
        `habitacion=${encodeURIComponent(numero)}&` +
        `fecha=${encodeURIComponent(fecha)}&` +
        `responsable=${encodeURIComponent(String(huesped.id))}&` +
        `responsablePagoId=${encodeURIComponent(String(responsablePagoId))}&` +
        `personaId=${encodeURIComponent(String(responsablePagoId))}&` +
        `cuit=${encodeURIComponent(cuitLimpio)}&` +
        `razonSocial=${encodeURIComponent(`${huesped.nombres ?? ''} ${huesped.apellido ?? ''}`.trim())}&` +
        `telefono=${encodeURIComponent(huesped.telefono || '')}&` +
        `nacionalidad=${encodeURIComponent(huesped.nacionalidad || '')}&` +
        `tipoDocumento=${encodeURIComponent(huesped.tipoDocumento || '')}&` +
        `documentacion=${encodeURIComponent(huesped.documentacion || '')}`
      );

    } catch (err) {
      console.error(err);
      window.alert('Ocurrió un error al procesar el Responsable de Pago.');
    }
  };

  const handleSiguiente = async () => {
    if (!selectedHuespedId) {
      window.alert('Por favor, selecciona un huésped responsable de pago de la lista.');
      return;
    }
    const seleccionado = resultados.find((h) => h.id === selectedHuespedId);
    if (!seleccionado) return;

    if (typeof seleccionado.edad === 'number' && seleccionado.edad < 18) {
      window.alert('La persona seleccionada es menor de edad, seleccione otra');
      return;
    }

    const cuitDigits = cuitSoloDigitos((seleccionado as any).cuit);

    // Si tiene CUIT válido, procesamos directamente
    if (cuitDigits && esCuitValido11(cuitDigits)) {
      await procesarResponsablePago(seleccionado, cuitDigits);
    } else {
      // Si NO tiene CUIT válido, mostramos el modal de opciones
      setMostrarModalOpciones(true);
    }
  };

 const handleOpcionConsumidorFinal = async () => {
  setMostrarModalOpciones(false);
  const seleccionado = resultados.find((h) => h.id === selectedHuespedId);
  if (!seleccionado) return;

  router.push(
    `/facturar/detalle?` +
    `habitacion=${encodeURIComponent(numero)}&` +
    `fecha=${encodeURIComponent(fecha)}&` +
    `responsable=${encodeURIComponent(String(seleccionado.id))}&` +
    `personaId=${encodeURIComponent(String(seleccionado.id))}&` + 
    
    `cuit=&` + // Sin CUIT
    `razonSocial=${encodeURIComponent(`${seleccionado.nombres ?? ''} ${seleccionado.apellido ?? ''}`.trim())}&` +
    `telefono=${encodeURIComponent(seleccionado.telefono || '')}&` +
    `nacionalidad=${encodeURIComponent(seleccionado.nacionalidad || '')}&` +
    `tipoDocumento=${encodeURIComponent(seleccionado.tipoDocumento || '')}&` +
    `documentacion=${encodeURIComponent(seleccionado.documentacion || '')}`
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

  if (!isListing) {
    return (
      <main className="ui-hero">
        <div className="ui-hero-bg" />
        <div className="ui-hero-overlay-65" />
        <div className="ui-hero-card">
           <h1 className="ui-hero-title">Generar Factura</h1>
           {error && (<div className="error-box"><p className="error-text">{error}</p></div>)}
           <form className="form" onSubmit={handleBuscar}>
             <div className="contenedor-input-grupo">
               <div className="input-con-accion">
                 <input ref={numeroRef} type="number" min="1" placeholder="N° Habitación" value={numero} onChange={(e) => { setNumero(e.target.value); setError(null); }} onFocus={() => setMostrarGrilla(false)} />
                 <button type="button" className="boton-desplegable" onClick={() => setMostrarGrilla(!mostrarGrilla)}>▼</button>
               </div>
               {mostrarGrilla && (
                 <div className="menu-flotante">
                   {listaHabitaciones.map((num) => (
                     <button key={num} type="button" className="item-habitacion" onClick={() => { setNumero(String(num)); setMostrarGrilla(false); setError(null); }}>{num}</button>
                   ))}
                 </div>
               )}
               <div>
                 <input ref={fechaRef} type="text" placeholder="Fecha de Salida" className="ui-input-date" value={fecha} onChange={(e) => { setFecha(e.target.value); setError(null); }} onFocus={(e) => (e.target.type = "date")}onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}/>               </div>
             </div>
             <div className="ui-actions-center">
               <button type="submit" className="btn" disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</button>
               <button type="button" onClick={handleCancelar} className="btn">Cancelar</button>
             </div>
           </form>
        </div>
      </main>
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

      {mostrarModalCuit && selectedHuespedId && (
        <ModalCuit
          huespedId={selectedHuespedId}
          onClose={() => setMostrarModalCuit(false)}
          onSuccess={handleCuitActualizado}
        />
      )}

      {mostrarModalOpciones && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Falta CUIT</h3>
            <p style={{ marginBottom: '25px', color: '#666' }}>
              El huésped seleccionado no tiene un CUIT válido registrado.
              ¿Cómo desea proceder?
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn" 
                onClick={() => { setMostrarModalOpciones(false); setMostrarModalCuit(true); }}
              >
                Cargar CUIT y Condición Fiscal
              </button>
              
              <button 
                className="btn" 
                style={{ backgroundColor: '#6c757d' }} 
                onClick={handleOpcionConsumidorFinal}
              >
                Continuar como Consumidor Final
              </button>
              
              <button 
                className="btn" 
                style={{ backgroundColor: 'transparent', color: '#333', border: '1px solid #ccc' }}
                onClick={() => setMostrarModalOpciones(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}