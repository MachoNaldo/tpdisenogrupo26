'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Reserva, CriteriosBusquedaReserva } from '../lib/tipos';
import '../styles/estilos.css';

// URL base del backend, asumimos que está en el .env.local
const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL;

const INITIAL_CRITERIA: CriteriosBusquedaReserva = {
  apellido: '',
  nombres: '',
};

export default function PaginaCancelarReserva() {
  const [criterios, setCriterios] = useState<CriteriosBusquedaReserva>(INITIAL_CRITERIA);
  const [resultados, setResultados] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // true: Muestra tabla de resultados, false: Muestra formulario
  const [isListing, setIsListing] = useState(false);

  // Renombrado: antes selectedHuespedId
  const [selectedReservaId, setSelectedReservaId] = useState<number | null>(null);

  const router = useRouter();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCriterios((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  // Buscar reservas por criterios: apellido/nombres -> query params
  const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResultados([]);
    setSelectedReservaId(null);

    // Construcción de query params (Builder simple)
    const params = new URLSearchParams();
    const apellido = criterios.apellido?.trim();
    const nombres = criterios.nombres?.trim();

    if (apellido) params.append('apellido', apellido);
    if (nombres) params.append('nombres', nombres);

    // Endpoint de reservas (antes: /api/huespedes/buscar)
    const url = `${SPRING_BOOT_API_URL}/api/reservas/buscar?${params.toString()}`;

    try {
      const response = await fetch(url, { credentials: 'include' });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: Reserva[] = await response.json();
      setResultados(data);
      setIsListing(true);

      if (data.length === 0) {
        const shouldGoToAlta = window.confirm('No existen reservas para los criterios de búsqueda.');
        if (shouldGoToAlta) {
          router.push('/seleccionarFechas');
        }
      }
    } catch (err) {
      console.error('Error al buscar reservas:', err);
      setError(
        'Error al comunicarse con el servidor de búsqueda. Asegúrese que el endpoint /api/reservas/buscar esté activo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    // Si estamos en la Vista 2 (Resultados)
    if (isListing) {
      // Volver a la Vista 1, manteniendo los criterios.
      setIsListing(false);
      setResultados([]);
      setSelectedReservaId(null);
    } else {
      // Si estamos en la Vista 1 (Criterios)
      router.push('/menu');
    }
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
      <h1 className="font-serif" style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontStyle: 'italic' }}>
        Cancelar Reservas
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="opacity-45" />
      </div>
    </header>
  );

  // Vista 1: Formulario
  if (!isListing) {
    return (
      <div className="estilo1">
        {renderHeader()}

        <main style={{ maxWidth: '500px', margin: '50px auto' }}>
          <form onSubmit={handleBuscar}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '15px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                <label
                  className="font-serif"
                  style={{ textAlign: 'right', fontStyle: 'italic', fontSize: '20px', marginBottom: '10px' }}
                >
                  Apellido
                </label>

                {/* IMPORTANTE: no anidar form dentro de form */}
                <div className="form">
                  <input
                    type="text"
                    name="apellido"
                    placeholder="Ej: Moreira"
                    value={criterios.apellido}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                <label
                  className="font-serif"
                  style={{ textAlign: 'right', fontStyle: 'italic', fontSize: '20px', marginBottom: '10px' }}
                >
                  Nombres
                </label>

                <div className="form">
                  <input
                    type="text"
                    name="nombres"
                    placeholder="Ej: Carlos"
                    value={criterios.nombres}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '80px', position: 'relative' }}>
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar reservas'}
              </button>

              <button className="btn" type="button" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </form>
        </main>
      </div>
    );
  }

  // Vista 2: Resultados
  return (
    <div className="estilo1">
      {renderHeader()}

      <main style={{ maxWidth: '900px', margin: '50px auto' }}>
        <table className="w-full border-[5px] border-[#a67c52] table-fixed border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#C1C1C1', color: '#000' }}>
              <th>Apellido</th>
              <th>Nombres</th>
              <th>Número de habitación</th>
              <th>Tipo de habitación</th>
              <th>Fecha inicial</th>
              <th>Fecha final</th>
            </tr>
          </thead>

         <tbody>
            {resultados.map((r: any, idx: number) => {
              const hab = r.reservas?.[0];
              const idReserva = hab?.idReserva;

              return (
                <tr className='border' key={idReserva || idx}
                  onClick={() => setSelectedReservaId(idReserva || null)}
                  style={{ cursor: 'pointer', backgroundColor: selectedReservaId === idReserva ? '#5B5EF3' : 'white', 
                  color: 'black', textAlign: 'center',}}>

                  <td className="border">{r.cliente?.apellido ?? ''}</td>
                  <td className="border">{r.cliente?.nombre ?? ''}</td>
                  <td className="border">{hab?.numeroHabitacion ?? ''}</td>
                  <td className="border">{hab?.tipo ?? ''}</td>
                  <td className="border">{hab?.fechaInicio ?? ''}</td>
                  <td className="border">{hab?.fechaFin ?? ''}</td>
                </tr>
              );
            })}
          </tbody>


        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '60px', gap: '30px' }}>
          <button className="btn" type="button" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      </main>
    </div>
  );
}
