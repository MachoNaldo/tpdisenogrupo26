'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HabitacionSeleccionada {
  numeroHabitacion: number;
  tipoHabitacion: string;
  fechaInicio: string;
  fechaFin: string;
}

interface Huesped {
  id: number;
  apellido: string;
  nombres: string;
  tipoDocumento: string;
  documentacion: string;
  edad: number;
}

interface AsignacionHuesped {
  habitacion: number;
  huespedPrincipal: Huesped | null;
  acompaniantes: Huesped[];
}

const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AsignarHuespedesPage() {
  const router = useRouter();
  const [habitaciones, setHabitaciones] = useState<HabitacionSeleccionada[]>([]);
  const [asignaciones, setAsignaciones] = useState<Record<number, AsignacionHuesped>>({});
  const [habitacionActualMostrandose, sethabitacionActualMostrandose] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para las busqueda de huespedes
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState<'principal' | 'acompaniante'>('principal');
  const [criteriosBusqueda, setCriteriosBusqueda] = useState({
    apellido: '',
    nombres: '',
    documento: ''
  });
  const [resultadosBusqueda, setResultadosBusqueda] = useState<Huesped[]>([]);
  const [buscando, setBuscando] = useState(false);
  // Carga inicial de habitaciones seleccionadas como tambien si se pide forzar la ocupacion
  useEffect(() => {
    const data = sessionStorage.getItem('habitacionesSeleccionadas');
    if (!data) {
      router.push('/');
      return;
    }

    const habitacionesData: HabitacionSeleccionada[] = JSON.parse(data);
    setHabitaciones(habitacionesData);

    // Inicializamos las asignaciones para cada habitacion
    const asignacionesIniciales: Record<number, AsignacionHuesped> = {};
    habitacionesData.forEach(h => {
      asignacionesIniciales[h.numeroHabitacion] = {
        habitacion: h.numeroHabitacion,
        huespedPrincipal: null,
        acompaniantes: []
      };
    });
    setAsignaciones(asignacionesIniciales);
  }, [router]);

  // Obtener habitación actual
  const habitacionActual = habitaciones[habitacionActualMostrandose];

  // Verifica si un huésped ya fue asignado como acompañante en alguna habitación
  const estaAsignadoComoAcompaniante = (huespedId: number): boolean => {
    return Object.values(asignaciones).some(asignacion => 
      asignacion.acompaniantes?.some(a => a.id === huespedId)
    );
  };

  // Verifica si un huésped es principal en la habitación actual
  const esPrincipalEnHabitacionActual = (huespedId: number): boolean => {
    return asignaciones[habitacionActual?.numeroHabitacion]?.huespedPrincipal?.id === huespedId;
  };

  const abrirBusquedaPrincipal = () => {
    setTipoBusqueda('principal');
    setMostrarBusqueda(true);
    setCriteriosBusqueda({ apellido: '', nombres: '', documento: '' });
    setResultadosBusqueda([]);
  };

  const abrirBusquedaAcompaniante = () => {
    setTipoBusqueda('acompaniante');
    setMostrarBusqueda(true);
    setCriteriosBusqueda({ apellido: '', nombres: '', documento: '' });
    setResultadosBusqueda([]);
  };

  const buscarHuesped = async (e: React.FormEvent) => {
    e.preventDefault();
    setBuscando(true);
    setError(null);

    const params = new URLSearchParams();
    if (criteriosBusqueda.apellido) params.append('apellido', criteriosBusqueda.apellido);
    if (criteriosBusqueda.nombres) params.append('nombres', criteriosBusqueda.nombres);
    if (criteriosBusqueda.documento) params.append('documentacion', criteriosBusqueda.documento);

    try {
      const response = await fetch(
        `${SPRING_BOOT_API_URL}/api/huespedes/buscar?${params.toString()}`,
        { credentials: 'include' }
      );

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Error en la búsqueda');
      }

      const data: Huesped[] = await response.json();
      setResultadosBusqueda(data);

      if (data.length === 0) {
        const shouldCreate = window.confirm(
          "No se encontraron huéspedes. ¿Desea crear un nuevo huésped?"
        );
        if (shouldCreate) {
          router.push('/crearhuesped');
        }
      }
    } catch (err) {
      console.error('Error al buscar:', err);
      setError('Error al buscar huéspedes');
    } finally {
      setBuscando(false);
    }
  };

  const seleccionarHuesped = (huesped: Huesped) => {
    if (tipoBusqueda === 'principal') {
      if(huesped.edad < 18){
        alert('El huésped principal debe ser mayor de edad.');
      }
      else{
      // Asigna el huesped principal a habitación actual
      setAsignaciones(prev => ({
        ...prev,
        [habitacionActual.numeroHabitacion]: {
          ...prev[habitacionActual.numeroHabitacion],
          huespedPrincipal: huesped
        }
      }))};
    } else {
      // Agrega un acompañante
      const asignacionActual = asignaciones[habitacionActual.numeroHabitacion];
      
      // No puede ser el mismo que el principal
      if (esPrincipalEnHabitacionActual(huesped.id)) {
        alert('El huésped principal no puede ser acompañante en la misma habitación.');
        return;
      }

      // No puede estar ya asignado como acompañante en otra habitación
      if (estaAsignadoComoAcompaniante(huesped.id)) {
        alert('Este huésped ya está asignado como acompañante en otra habitación.');
        return;
      }

      // Verificar que no esté ya agregado en esta habitación
      if (asignacionActual.acompaniantes?.some(a => a.id === huesped.id)) {
        alert('Este huésped ya está agregado como acompañante en esta habitación.');
        return;
      }

      setAsignaciones(prev => ({
        ...prev,
        [habitacionActual.numeroHabitacion]: {
          ...prev[habitacionActual.numeroHabitacion],
          acompaniantes: [...(prev[habitacionActual.numeroHabitacion].acompaniantes || []), huesped]
        }
      }));
    }

    setMostrarBusqueda(false);
    setResultadosBusqueda([]);
  };

  const eliminarAcompaniante = (huespedId: number) => {
    setAsignaciones(prev => ({
      ...prev,
      [habitacionActual.numeroHabitacion]: {
        ...prev[habitacionActual.numeroHabitacion],
        acompaniantes: prev[habitacionActual.numeroHabitacion].acompaniantes?.filter(a => a.id !== huespedId) || []
      }
    }));
  };

  const continuarSiguienteHabitacion = () => {
    setError(null);

    // Valida que la habitación actual al menos tenga huésped principal
    if (!asignaciones[habitacionActual.numeroHabitacion]?.huespedPrincipal) {
      setError('Debe asignar un huésped principal antes de continuar');
      return;
    }

    // Si hay más habitaciones, pasa a la siguiente
    if (habitacionActualMostrandose < habitaciones.length - 1) {
      sethabitacionActualMostrandose(prev => prev + 1);
    } else {
      // Si es la última, confirma
      confirmarAsignaciones();
    }
  };

  const volverHabitacionAnterior = () => {
    if (habitacionActualMostrandose > 0) {
      sethabitacionActualMostrandose(prev => prev - 1);
      setError(null);
    }
  };

  const confirmarAsignaciones = async () => {
    setError(null);

    // Valida que todas las habitaciones tengan al menos un huésped principal
    for (const hab of habitaciones) {
      if (!asignaciones[hab.numeroHabitacion]?.huespedPrincipal) {
        setError(`La habitación ${hab.numeroHabitacion} necesita un huésped principal`);
        return;
      }
    }

    // Prepara todos los datos necesarios para enviar al backend
    const estadiasParaEnviar = habitaciones.map((hab) => {
      const asignacion = asignaciones[hab.numeroHabitacion];
      const principal = asignacion.huespedPrincipal!;
      
      return {
        numeroHabitacion: hab.numeroHabitacion,
        fechaInicio: hab.fechaInicio,
        fechaFin: hab.fechaFin,
        huespedPrincipal: {
          nombre: principal.nombres,
          apellido: principal.apellido,
          documento: principal.documentacion,
          telefono: "",
          id: String(principal.id)
        },
        acompanantes: asignacion.acompaniantes?.map(acomp => ({
          nombre: acomp.nombres,
          apellido: acomp.apellido,
          documento: acomp.documentacion,
          telefono: "",
          id: String(acomp.id)
        })) || []
      };
    });

    const payload = {
      estadias: estadiasParaEnviar
    };

    // Verifica si se debe forzar la ocupación
    const forzar = sessionStorage.getItem('forzarOcupacion') === 'true';
    const url = `${SPRING_BOOT_API_URL}/api/estadias/ocupar${forzar ? '?forzar=true' : ''}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al registrar estadías');
      }

      // Limpiar sessionStorage
      sessionStorage.removeItem('habitacionesSeleccionadas');
      sessionStorage.removeItem('forzarOcupacion');
      
      alert('✅ Estadías registradas exitosamente');
      router.push('/menu');
    } catch (err) {
      console.error('Error:', err);
      setError('Error al registrar las estadías');
    }
  };

  const renderHeader = () => (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '20px 40px', 
      backgroundColor: '#000', 
      borderBottom: '2px solid #b8975a' 
    }}>
      <h1 className="font-serif" style={{ 
        fontFamily: 'Georgia, serif', 
        fontSize: '42px', 
        fontStyle: 'italic', 
        color: '#b8975a' 
      }}>
        Asignar Huéspedes
      </h1>
      <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="opacity-45"/>
    </header>
  );

  if (habitaciones.length === 0 || !habitacionActual) {
    return <div className="text-[#b8975a] text-center mt-10">Cargando...</div>;
  }

  const asignacionActual = asignaciones[habitacionActual.numeroHabitacion];
  const principal = asignacionActual?.huespedPrincipal;
  const esUltimaHabitacion = habitacionActualMostrandose === habitaciones.length - 1;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
      {renderHeader()}

      <main style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        {error && (
          <div className="text-white bg-red-700 px-4 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Indicador de progreso */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: '#b8975a'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            Habitación {habitacionActualMostrandose + 1} de {habitaciones.length}
          </h2>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'center',
            marginTop: '15px'
          }}>
            {habitaciones.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: index === habitacionActualMostrandose ? '#b8975a' : '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: index === habitacionActualMostrandose ? '#000' : '#666',
                  fontWeight: 'bold'
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Información de la habitación actual */}
        <div
          style={{
            border: '2px solid #b8975a',
            borderRadius: '12px',
            padding: '30px',
            backgroundColor: '#1a1a1a',
            marginBottom: '30px'
          }}
        >
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#b8975a', fontSize: '1.8rem', marginBottom: '10px' }}>
              Habitación {habitacionActual.numeroHabitacion} - {habitacionActual.tipoHabitacion}
            </h3>
            <p style={{ color: '#888', fontSize: '1.1rem' }}>
              {habitacionActual.fechaInicio} → {habitacionActual.fechaFin}
            </p>
          </div>

          {/* Huésped Principal */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h4 style={{ color: '#b8975a', margin: 0, fontSize: '1.3rem' }}>
                Huésped Principal:
              </h4>
              <button className='btn'
                onClick={abrirBusquedaPrincipal}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  width: '210px',
                }}
              >
                {principal ? 'Cambiar Principal' : 'Buscar Principal'}
              </button>
            </div>
            
            {principal ? (
              <div style={{
                padding: '15px',
                backgroundColor: '#000',
                border: '2px solid #b8975a',
                borderRadius: '8px'
              }}>
                <p style={{ color: '#b8975a', margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {principal.apellido}, {principal.nombres}
                </p>
                <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '1rem' }}>
                  {principal.tipoDocumento}: {principal.documentacion}
                </p>
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic', fontSize: '1rem' }}>
                ⚠ No asignado (requerido)
              </p>
            )}
          </div>

          {/* Acompañantes */}
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h4 style={{ color: '#b8975a', margin: 0, fontSize: '1.3rem' }}>
                Acompañantes:
              </h4>
              <button className='btn'
                onClick={abrirBusquedaAcompaniante}
                style={{
                  padding: '10px 20px',
                  color: '#fff',
                  backgroundColor: '#5a8fb8',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                <span className='mr-1' style={{fontSize: '20px'}}>+</span> Agregar Acompañante
              </button>
            </div>

            {asignacionActual?.acompaniantes && asignacionActual.acompaniantes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {asignacionActual.acompaniantes.map(acomp => (
                  <div key={acomp.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      flex: 1,
                      padding: '15px',
                      backgroundColor: '#000',
                      border: '1px solid #5a8fb8',
                      borderRadius: '8px'
                    }}>
                      <p style={{ color: '#5a8fb8', margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {acomp.apellido}, {acomp.nombres}
                      </p>
                      <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '1rem' }}>
                        {acomp.tipoDocumento}: {acomp.documentacion}
                      </p>
                    </div>
                    <button
                      onClick={() => eliminarAcompaniante(acomp.id)}
                      style={{
                        padding: '8px 15px',
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '1.2rem'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', fontStyle: 'italic', fontSize: '1rem' }}>
                Sin acompañantes (opcional)
              </p>
            )}
          </div>
        </div>

        {/* Botones de navegación */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <button className='btn'
            onClick={volverHabitacionAnterior}
            disabled={habitacionActualMostrandose === 0}
            style={{
              padding: '15px 30px',
              backgroundColor: habitacionActualMostrandose === 0 ? '#333' : '#666',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: habitacionActualMostrandose === 0 ? 'not-allowed' : 'pointer',
              opacity: habitacionActualMostrandose === 0 ? 0.5 : 1
            }}
          >
            ← Anterior
          </button>

          <button className='btn'
            onClick={() => router.back()}
            style={{
              padding: '15px 30px',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
            Modificar habitaciones
          </button>

          <button className='btn'
            onClick={continuarSiguienteHabitacion}
            style={{
              padding: '15px 30px',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {esUltimaHabitacion ? 'Confirmar y Ocupar ✓' : 'Continuar →'}
          </button>
        </div>
      </main>

      {/* Modal de búsqueda */}
      {mostrarBusqueda && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '2px solid #b8975a'
          }}>
            <h2 style={{ color: '#b8975a', marginBottom: '20px', fontSize: '1.5rem' }}>
              Buscar {tipoBusqueda === 'principal' ? 'Huésped Principal' : 'Acompañante'}
            </h2>

            <form onSubmit={buscarHuesped} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Apellido"
                  value={criteriosBusqueda.apellido}
                  onChange={(e) => setCriteriosBusqueda(prev => ({ ...prev, apellido: e.target.value }))}
                  style={{
                    padding: '12px',
                    backgroundColor: '#000',
                    border: '1px solid #b8975a',
                    borderRadius: '6px',
                    color: '#b8975a',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Nombres"
                  value={criteriosBusqueda.nombres}
                  onChange={(e) => setCriteriosBusqueda(prev => ({ ...prev, nombres: e.target.value }))}
                  style={{
                    padding: '12px',
                    backgroundColor: '#000',
                    border: '1px solid #b8975a',
                    borderRadius: '6px',
                    color: '#b8975a',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="text"
                  placeholder="Documento"
                  value={criteriosBusqueda.documento}
                  onChange={(e) => setCriteriosBusqueda(prev => ({ ...prev, documento: e.target.value }))}
                  style={{
                    padding: '12px',
                    backgroundColor: '#000',
                    border: '1px solid #b8975a',
                    borderRadius: '6px',
                    color: '#b8975a',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  disabled={buscando}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#b8975a',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                >
                  {buscando ? 'Buscando...' : 'Buscar'}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarBusqueda(false)}
                  style={{
                    padding: '12px 25px',
                    backgroundColor: '#666',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Cerrar
                </button>
              </div>
            </form>

            {/* Resultados */}
            {resultadosBusqueda.length > 0 && (
              <div>
                <h3 style={{ color: '#b8975a', marginBottom: '15px', fontSize: '1.2rem' }}>
                  Resultados:
                </h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {resultadosBusqueda.map(huesped => (
                    <div
                      key={huesped.id}
                      onClick={() => seleccionarHuesped(huesped)}
                      style={{
                        padding: '15px',
                        backgroundColor: '#000',
                        border: '1px solid #b8975a',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
                    >
                      <p style={{ color: '#b8975a', margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {huesped.apellido}, {huesped.nombres}
                      </p>
                      <p style={{ color: '#888', margin: '5px 0 0 0', fontSize: '0.95rem' }}>
                        {huesped.tipoDocumento}: {huesped.documentacion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}