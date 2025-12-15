'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Huesped, CriteriosBusquedaHuesped, TiposDocumentoArray } from '../lib/tipos'; 
import { useEffect } from "react";
import EliminarHuespedDialog from '../components/BotonEliminarHuesped';
import "../styles/estilos.css"; 


// URL base del backend, asumimos que está en el .env.local
const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL; 

const INITIAL_CRITERIA: CriteriosBusquedaHuesped = {
    apellido: '',
    nombres: '',
    tipoDocumento: '',
    documento: ''
};

export default function BuscarHuespedPage() {
    const [criterios, setCriterios] = useState<CriteriosBusquedaHuesped>(INITIAL_CRITERIA);
    const [resultados, setResultados] = useState<Huesped[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    // NUEVO ESTADO PARA ELIMINAR
    const [huespedToDelete, setHuespedToDelete] = useState<Huesped | null>(null); 

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

    // Función que devuelve los criterios de búsqueda al formato URL
    const buildSearchUrl = (criteria: CriteriosBusquedaHuesped) => {
        const params = new URLSearchParams();
        Object.entries(criteria).forEach(([key, value]) => {
            if (value && value !== '---' && value !== '') {
                const backendKey = key === 'documento' ? 'documentacion' : key;
                params.append(backendKey, value);
            }
        });
        return `${SPRING_BOOT_API_URL}/api/huespedes/buscar?${params.toString()}`;
    };


    // Lógica principal: Patrón Builder y Fetching
    const handleBuscar = async (e: React.FormEvent | null) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        setResultados([]); 
        setSelectedHuespedId(null);
        const params = new URLSearchParams();
        
        Object.entries(criterios).forEach(([key, value]) => {
            if (value && value !== '---' && value !== '') {

                const backendKey = key === 'documento' ? 'documentacion' : key;
                params.append(backendKey, value);
            }
        });


        const url = buildSearchUrl(criterios); 
        
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
            setIsListing(true);
            
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
    
    const handleSiguiente = () => {
        if (!selectedHuespedId) {
            const shouldGoToAlta = window.confirm(
                "No ha seleccionado un huésped. ¿Desea ejecutar 'Dar Alta de Huésped'?"
            );
            if (shouldGoToAlta) {
                router.push('/crearhuesped'); 
            }
            return;
        }
        
       
        router.push(`/gestionreserva/${selectedHuespedId}`); 
    };
    
    const handleCancelar = () => {
   
    if (isListing) {
        
        setIsListing(false); 
        setResultados([]);
        setSelectedHuespedId(null);
    } 

    else {
        router.push('/menu'); 
    }
};

    const handleBorrar = () => {
        if (!selectedHuespedId) {
            alert("Debe seleccionar un huésped para borrar.");
            return;
        }
        
        const selectedHuesped = resultados.find(h => h.id === selectedHuespedId);
        
        if (selectedHuesped) {
            setHuespedToDelete(selectedHuesped);
        } else {
            alert("Error: Huésped seleccionado no encontrado en la lista.");
        }
    };
    
    const handleEliminarCerrar = (eliminado: boolean) => {
        setHuespedToDelete(null);
        
        if (eliminado) {
             // Si fue eliminado con exito, se rrecarga la lista.
             handleBuscar(null);
        }
    };

    const renderHeader = () => (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#000', borderBottom: '2px solid #b8975a'}}>
            <h1 className="font-serif" style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontStyle: 'italic'}}>
                Buscar huésped
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="opacity-45"/> 
            </div>
        </header>
    );

    if (!isListing) {
        return (
            <div className="estilo1">
                {renderHeader()}
                <main style={{ maxWidth: '500px', margin: '50px auto' }}>
                    
                    <form onSubmit={handleBuscar}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', marginTop: '15px' }}>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px', alignItems: 'center' }}>
                                <label className="font-serif" style={{textAlign: 'right', fontStyle: 'italic', fontSize: "20px", marginBottom: "10px"}}>
                                    Apellido
                                </label>
                                <form className="form">
                                <input type="text" name="apellido" placeholder="Ej: Ojeda" value={criterios.apellido} onChange={handleChange} />
                                </form>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '20px', alignItems: 'center' }}>
                                <label className="font-serif" style={{textAlign: 'right', fontStyle: 'italic', fontSize: "20px", marginBottom: "10px"}}>
                                    Nombres
                                </label>
                                <form className="form">
                                <input type="text" name="nombres" placeholder="Ej: Eduardo Nicolás" value={criterios.nombres} onChange={handleChange}/>
                                </form>
                            </div>

                            <div style={{display: 'grid', gridTemplateColumns: '160px 1fr', gap: '20px', alignItems: 'center' }}>
                                <label className="font-serif" style={{textAlign: 'right', fontStyle: 'italic', fontSize: "18px", marginBottom: "10px"}}>
                                    Tipo de documento
                                </label>
                                <form className="form">
                                    <select name="tipoDocumento" value={criterios.tipoDocumento} onChange={handleChange} style={{marginRight:"300px", maxWidth: '200px', cursor: 'pointer' }}>
                                        <option value="">---</option>
                                        {TiposDocumentoArray.map(tipo => (
                                            <option key={tipo} value={tipo}>{tipo}</option>
                                        ))}
                                    </select>
                                </form>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '25px', alignItems: 'center' }}>
                                <label className="font-serif" style={{textAlign: 'right', fontStyle: 'italic', fontSize: "20px", marginBottom: "10px"}}>
                                    Documento
                                </label>
                                <form className="form">
                                <input type="text" name="documento" value={criterios.documento} onChange={handleChange}/>
                                </form>
                            </div>
                        </div>
                        
                        {error && <p style={{color: 'red', textAlign: 'center', marginTop: '20px'}}>{error}</p>}
                        
                        
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '80px', position: 'relative'}}>
                            <button className="btn" type="submit" disabled={loading}>
                                {loading ? 'Buscando...' : 'Buscar huésped'}
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
    
    return (
        <div className='estilo1'>
            {renderHeader()}
            
            <main style={{ maxWidth: '900px', margin: '50px auto' }}>

                <table className="w-full border-[5px] border-[#a67c52]
                table-fixed border-collapse">
                    <thead>
                        <tr style={{backgroundColor: '#C1C1C1', color: '#000' }}>
                            <th>Apellido</th>
                            <th>Nombres</th>
                            <th>Tipo de doc</th>
                            <th>Documento</th>
                        </tr>
                    </thead>
                    <tbody >
                        {resultados.map((huesped) => (
                            <tr className='border' key={huesped.id} 
                                onClick={() => setSelectedHuespedId(huesped.id || null)}
                                style={{
                                    cursor: 'pointer', backgroundColor: selectedHuespedId === huesped.id ? '#5B5EF3' : 'white',
                                    color: "black", textAlign:'center'}}>
                                <td className='border'>{huesped.apellido}</td>
                                <td className='border'>{huesped.nombres}</td>
                                <td className='border'>{huesped.tipoDocumento}</td>
                                <td className='border'>{huesped.documentacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                

                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '60px', gap: '30px'}}>
                    <button 
                        className="btn" 
                        type="button" 
                        onClick={handleBorrar} 
                        disabled={!selectedHuespedId}
                        style={{backgroundColor: selectedHuespedId ? '#D9534F' : '#5b5b5bff'}} // Color rojo para Borrar
                    >
                        Borrar
                    </button>

                    <button className= "btn" type="button" onClick={handleSiguiente}>
                        Siguiente
                    </button>
                    <button className= "btn" type="button" onClick={handleCancelar}>
                        Cancelar
                    </button>
                </div>
            </main>
            {huespedToDelete && (
                <EliminarHuespedDialog 
                    huesped={huespedToDelete} 
                    onClose={handleEliminarCerrar} 
                />
            )}
        </div>
    );
};