'use client';

import React, { useState , useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Huesped, TiposDocumentoArray } from '../lib/tipos'; 
import { useEffect } from "react";
import "./huespedes.css"; 


// URL base del backend, asumimos que está en el .env.local
const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL; 


export default function FacturarPage() {
    const [fecha, setFecha] = useState<string>('');
    const [numero, setNumero] = useState<string>('');
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

//    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//    const { name, value } = e.target;

//    if (name === 'numero') {
//        setNumero(value);
//    } else if (name === 'fecha') {
//        setFecha(value); 
//    }

//    setError(null);
//   };




 const fechaRef = useRef<HTMLInputElement>(null);
 const numeroRef = useRef<HTMLInputElement>(null);



const handleBuscar = async (e: React.FormEvent) => {
    e.preventDefault();

    const erroresDetectados: string[] = [];
    let primerInputConError: HTMLInputElement | null = null;

    //Primero verificamos cada variable segun el caso de uso
    //Validación Fecha
    if (!fecha) {
        erroresDetectados.push("fecha faltante");
        //Guardamos la referencia para el foco
        if (!primerInputConError) primerInputConError = fechaRef.current;
    }
    else {
        const fechaIngresada = new Date(fecha + "T00:00:00");
        const hoy = new Date();
        
        hoy.setHours(0, 0, 0, 0);

        if (fechaIngresada < hoy) {
            erroresDetectados.push("fecha incorrecta");
            if (!primerInputConError) primerInputConError = fechaRef.current;
        }
    }

    //Validación Numero
    if (!numero) {
        erroresDetectados.push("número de habitación faltante");
        if (!primerInputConError) primerInputConError = numeroRef.current;
    } 
    else if (isNaN(Number(numero))) { //Chequea si es un formato inválido
         erroresDetectados.push("número de habitación incorrecto");
         if (!primerInputConError) primerInputConError = numeroRef.current;
    } else{

        try {
        // Preguntamos a la base de datos si existe la habitación

        const checkRes = await fetch(
            `${SPRING_BOOT_API_URL}/api/habitaciones/${numero}/existe`,
            { credentials: 'include' }
        );

        if (!checkRes.ok) {
            setError("Error al verificar la habitación.");
            return; 
        }

        const existe = await checkRes.json(); //Devuelve true o false

        if (!existe) {
            setError(`⚠️ La habitación ${numero} no existe en el hotel.`);
            
            if (!primerInputConError) primerInputConError = numeroRef.current;
            
        }

    } catch (err) {
        console.error(err);
        setError("No se pudo conectar con el servidor para verificar la habitación.");
        return;
    }

    }

    // Flujo 3.A
    if (erroresDetectados.length > 0) {
        // 3.A.1: Mensaje único con TODOS los errores explicitos
        
        setError(`⚠️ Errores: ${erroresDetectados.join(", ")}.`);

        // 3.A.2: El sistema pone el foco en el primer campo faltante
        if (primerInputConError) {
            primerInputConError.focus();
        }
        
        return; // Vuelve al punto 3 (detiene el flujo principal)
    }


    setLoading(true);
    setError(null);
    setResultados([]); 
    setSelectedHuespedId(null);
    
    
    const params = new URLSearchParams();
    
    params.append('fecha', fecha); 
    params.append('numero', numero);

    //Carga de datos para pedir a la api la lista de huespedes

    const url = `${SPRING_BOOT_API_URL}/api/ ... ${params.toString()}`;
    
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

    } catch (err) {
       console.error('Error al buscar huéspedes:', err);
            setError('Error al comunicarse con el servidor de búsqueda. Asegúrese que el endpoint /app/.../buscar esté activo.');
    } finally {
        setLoading(false);
    }

};


    const handleCancelar = () => {
        router.push('/menu'); 
    };
    
    // Helper para el encabezado (replicando el diseño)
    const renderHeader = () => (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#000', borderBottom: '2px solid #b8975a' }}>
            <h1 className="font-serif" style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontStyle: 'italic', color: '#b8975a' }}>
                Elegir responsable de pago
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="opacity-45"/> 
            </div>
        </header>
    );


    // --- VISTA 1: CRITERIOS DE BÚSQUEDA (Window.jpg) ---
    if (!isListing) {
        return (
    <main className="min-h-screen flex items-center justify-center relative text-white bg-black">


      {/* Imagen decorativa central */}
      <div className="absolute inset-0 bg-[url('/img/Fondo4.png')] 
                      bg-center bg-contain bg-no-repeat opacity-40 pointer-events-none" />

      {/* Fondo oscuro encima */}
      <div className="absolute inset-0 bg-black/80" />

      {/* Marco principal */}
      <div className="relative bg-black/60 border border-[#d6a85b] rounded-xl 
                      shadow-2xl px-14 py-10 w-[650px] text-center">

        {/* Título */}
        <h1 className="text-5xl font-[Georgia] text-[#d6a85b] mb-4 italic">
          Generar Factura
        </h1>

        {/* Error */}
        {error && (
          <div className="text-red-400 mb-5 text-sm border border-red-400 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="flex flex-col items-center gap-6 mb-10">

          {/* Numero de Habitación */}
          <div className="flex flex-col items-center">
            
            <input
              type="number"
              min="1"
              placeholder="Numero de Habitación"
              className="bg-transparent border border-[#d6a85b] text-white 
                         px-4 py-3 rounded-xl text-center w-[250px] 
                         font-[Georgia] focus:outline-none"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>

          {/* Fecha de salida*/}
          <div className="flex flex-col items-center">
           
            <input
              type="date"
              placeholder="Fecha de salida"
              className="bg-transparent border border-[#d6a85b] text-white 
                         px-4 py-3 rounded-xl text-center w-[250px] 
                         font-[Georgia] focus:outline-none"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-25 mt-6">

            <button
              onClick={handleBuscar}
              className="bg-[#a67c52] hover:bg-[#c39a4f] text-white px-12 py-3 rounded-xl 
                        font-[Georgia] text-xl shadow-md transition">
              Buscar
            </button>

            <button
              onClick={handleCancelar}
              className="bg-[#a67c52] hover:bg-[#c39a4f] text-white px-10 py-3 rounded-xl 
                        font-[Georgia] text-xl shadow-md transition">
              Cancelar
            </button>

        </div>
      </div>
    </main>
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