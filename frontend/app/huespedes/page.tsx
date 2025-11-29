'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Huesped, CriteriosBusqueda, TiposDocumentoArray } from '../lib/tipos'; 
import { useEffect } from "react";
import "./huespedes.css"; 


// URL base del backend, asumimos que está en el .env.local
const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL; 

const INITIAL_CRITERIA: CriteriosBusqueda = {
    apellido: '',
    nombres: '',
    tipoDocumento: '',
    documento: ''
};

export default function BuscarHuespedPage() {
    const [criterios, setCriterios] = useState<CriteriosBusqueda>(INITIAL_CRITERIA);
    const [resultados, setResultados] = useState<Huesped[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
    const verificarSesion = async () => {
        try {
            const res = await fetch(`${SPRING_BOOT_API_URL}/revisar-sesion`, {
                credentials: "include",
            });

            if (!res.ok) {
                router.push("/login");
                return;
            }

            const data = await res.json();
            if (!data.autenticado) {
                router.push("/login");
            }

        } catch (err) {
            router.push("/login");
        }
    };

    verificarSesion();
}, []);

    
    // true: Muestra tabla de resultados (Window-1.jpg), false: Muestra formulario (Window.jpg)
    const [isListing, setIsListing] = useState(false);
    const [selectedHuespedId, setSelectedHuespedId] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCriterios({
            ...criterios,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    // Lógica principal: Patrón Builder y Fetching
    const handleBuscar = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResultados([]); 
        setSelectedHuespedId(null);
        
        // 1. Aplicando lógica Builder para Criterios: Construir URL de Query
        const params = new URLSearchParams();
        
        Object.entries(criterios).forEach(([key, value]) => {
            // Solo incluimos el criterio si tiene valor
            if (value && value !== '---' && value !== '') {
                // Mapeamos 'documento' del frontend a 'documentacion' del backend
                const backendKey = key === 'documento' ? 'documentacion' : key;
                params.append(backendKey, value);
            }
        });

        // 2. Endpoint final
        // Endpoint: /app/huespedes/buscar?apellido=X&documentacion=Y
        const url = `${SPRING_BOOT_API_URL}/api/huespedes/buscar?${params.toString()}`;
        
        try {
            const response = await fetch(url, { credentials: 'include' });
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data: Huesped[] = await response.json();
            setResultados(data);
            setIsListing(true); // Pasar a la vista de resultados
            
            // 3. Manejo del Flujo Alternativo (4.A) - Si no hay coincidencias
            if (data.length === 0) {
                const shouldGoToAlta = window.confirm(
                    "No existe ninguna concordancia. ¿Desea ejecutar 'Dar Alta de Huésped'?"
                );
                if (shouldGoToAlta) {
                    router.push('/crearhuesped'); // Ejecutar CU11
                }
            }

        } catch (err) {
            console.error('Error al buscar huéspedes:', err);
            setError('Error al comunicarse con el servidor de búsqueda. Asegúrese que el endpoint /app/huespedes/buscar esté activo.');
        } finally {
            setLoading(false);
        }
    };
    
    // 4. Manejo del Botón Siguiente (Paso 5 & 6)
    const handleSiguiente = () => {
        if (!selectedHuespedId) {
            // Flujo Alternativo 5.A: Presionar SIGUIENTE sin seleccionar
            const shouldGoToAlta = window.confirm(
                "No ha seleccionado un huésped. ¿Desea ejecutar 'Dar Alta de Huésped'?"
            );
            if (shouldGoToAlta) {
                router.push('/crearhuesped'); 
            }
            return;
        }
        
        // Redirigir a la siguiente etapa del TP (ej: Modificar/Reserva)
        router.push(`/gestionreserva/${selectedHuespedId}`); 
    };
    
    // 5. Manejo del Botón Cancelar
    const handleCancelar = () => {
        router.push('/menu'); 
    };
    
    // Helper para el encabezado (replicando el diseño)
    const renderHeader = () => (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#000', borderBottom: '2px solid #b8975a' }}>
            <h1 className="font-serif" style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontStyle: 'italic', color: '#b8975a' }}>
                Buscar huésped
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="opacity-45"/> 
            </div>
        </header>
    );


    // --- VISTA 1: CRITERIOS DE BÚSQUEDA (Window.jpg) ---
    if (!isListing) {
        return (
            <div className="huespedes-bg">
                {renderHeader()}
                <main style={{ maxWidth: '600px', margin: '50px auto' }}>
                    
                    <form onSubmit={handleBuscar}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px' }}>
                            {/* Fila Apellido */}
                            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px', alignItems: 'center' }}>
                                <label className="font-serif" style={{textAlign: 'right', fontStyle: 'italic'}}>Apellido</label>
                                <input type="text" name="apellido" placeholder="Ej: Ojeda" value={criterios.apellido} onChange={handleChange} style={inputStyle} />
                            </div>
                            {/* Fila Nombres */}
                            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px', alignItems: 'center' }}>
                                <label className="font-serif" style={{textAlign: 'right', fontStyle: 'italic'}}>Nombres</label>
                                <input type="text" name="nombres" placeholder="Ej: Eduardo Nicolás" value={criterios.nombres} onChange={handleChange} style={inputStyle} />
                            </div>
                            {/* Fila Tipo de documento */}
                            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px', alignItems: 'center' }}>
                                <label className="font-serif" style={{textAlign: 'right', fontStyle: 'italic'}}>Tipo de documento</label>
                                <select name="tipoDocumento" value={criterios.tipoDocumento} onChange={handleChange} style={{ ...inputStyle, maxWidth: '200px', cursor: 'pointer' }}>
                                    <option value="">---</option>
                                    {TiposDocumentoArray.map(tipo => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Fila Documento */}
                            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px', alignItems: 'center' }}>
                                <label className="font-serif" style={{textAlign: 'right', fontStyle: 'italic'}}>Documento</label>
                                <input type="text" name="documento" value={criterios.documento} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                        
                        {error && <p style={{color: 'red', textAlign: 'center', marginTop: '20px'}}>{error}</p>}
                        
                        {/* Botones de Acción */}
                        <div className="font-serif" style={{display: 'flex', justifyContent: 'center', marginTop: '100px', gap: '80px', position: 'relative'}}>
                            <button type="submit" disabled={loading} style={submitButtonStyle}>
                                {loading ? 'Buscando...' : 'Buscar huésped'}
                            </button>
                            <button type="button" onClick={handleCancelar} style={cancelButtonStyle}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        );
    }
    
    // --- VISTA 2: RESULTADOS (Window-1.jpg) ---
    return (
        <div className='huespedes-bg'>
            {renderHeader()}
            
            <main style={{ maxWidth: '900px', margin: '50px auto' }}>
                
                {/* Tabla de Resultados replicando Window-1.jpg */}
                <table className="font-serif"style={{width: '100%', borderCollapse: 'collapse', border: '2px solid #b8975a'}}>
                    <thead>
                        <tr style={{backgroundColor: '#b8975a', color: '#000'}}>
                            <th style={tableHeaderStyle}>Apellido</th>
                            <th style={tableHeaderStyle}>Nombres</th>
                            <th style={tableHeaderStyle}>Tipo de doc</th>
                            <th style={tableHeaderStyle}>Documento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map((huesped) => (
                            <tr 
                                key={huesped.documentacion} 
                                onClick={() => setSelectedHuespedId(huesped.id || null)}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selectedHuespedId === huesped.id ? 'rgba(184, 151, 90, 0.4)' : 'transparent',
                                    color: selectedHuespedId === huesped.id ? '#000' : '#b8975a'
                                }}
                            >
                                <td style={tableCellStyle}>{huesped.apellido}</td>
                                <td style={tableCellStyle}>{huesped.nombres}</td>
                                <td style={tableCellStyle}>{huesped.tipoDocumento}</td>
                                <td style={tableCellStyle}>{huesped.documentacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Botones de Acción (Window-1.jpg) */}
                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '60px', gap: '30px'}}>
                    <button type="button" onClick={handleSiguiente} style={submitButtonStyle}>
                        Siguiente
                    </button>
                    <button type="button" onClick={handleCancelar} style={cancelButtonStyle}>
                        Cancelar
                    </button>
                </div>
            </main>
        </div>
    );
};

// --- Estilos Internos para replicar el diseño ---

const inputStyle: React.CSSProperties = {
    padding: '10px 15px',
    border: '1px solid #b8975a',
    backgroundColor: 'transparent',
    color: '#b8975a',
    borderRadius: '4px',
    fontSize: '1rem',
};

const submitButtonStyle: React.CSSProperties = {
    padding: '12px 40px',
    backgroundColor: '#b8975a',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
};

const cancelButtonStyle: React.CSSProperties = {
    padding: '12px 40px',
    backgroundColor: '#b8975a',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
};

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