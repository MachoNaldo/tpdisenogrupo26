'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Huesped } from '../lib/tipos'; 

// URL base del backend
const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL;

type DialogState = 'CONFIRMACION' | 'EXITO' | 'ERROR_RESTRICCION' | 'LOADING_INTERNAL';

interface EliminarHuespedDialogProps {
    huesped: Huesped;
    onClose: (eliminado: boolean) => void;
}

export default function EliminarHuespedDialog({ huesped, onClose }: EliminarHuespedDialogProps) {
    const [dialogState, setDialogState] = useState<DialogState>('CONFIRMACION');
    const [mensajeError, setMensajeError] = useState<string>('');
    
    const { id, nombres, apellido, tipoDocumento, documentacion } = huesped;

    const handleEliminarConfirmado = async () => {
        if (!id || dialogState === 'LOADING_INTERNAL') return; 

        setDialogState('LOADING_INTERNAL'); 
        setMensajeError('');

        try {
            const response = await fetch(`${SPRING_BOOT_API_URL}/api/huespedes/eliminar/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) { 
                setDialogState('EXITO');
            } 
            
            else if (response.status === 409) { 
                const errorBody = await response.text();
                setMensajeError(errorBody || "El huésped no puede ser eliminado pues se ha alojado en el Hotel en el Hotel en alguna oportunidad.");
                setDialogState('ERROR_RESTRICCION');
            }
            
            else { 
                const errorBody = await response.text();
                console.error(`Error de eliminación (${response.status}): ${errorBody}`);
                setMensajeError(errorBody || `Error HTTP ${response.status}: Error al intentar eliminar.`);
                setDialogState('ERROR_RESTRICCION');
            }

        } catch (error) { 
            console.error('Error de red al eliminar:', error);
            setMensajeError("Error de red: No se pudo conectar con el servidor.");
            setDialogState('ERROR_RESTRICCION');
        }
    };
    
    const handleCerrar = (eliminado: boolean) => {
        onClose(eliminado);
    };
    
    let titulo = "Dar baja de huésped";
    let mensaje = "";
    let icono = null;
    let botonPrincipal = null;
    
    const huespedInfo = `${nombres} ${apellido}, ${tipoDocumento}: ${documentacion}`;
    
    const isConfirming = dialogState === 'CONFIRMACION';
    const isLoadingInternal = dialogState === 'LOADING_INTERNAL';


    if (isConfirming) {
        mensaje = `Los datos del huésped:  ${huespedInfo} serán eliminados del sistema.`;
        botonPrincipal = (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '40px'}}>
                <button 
                    className="btn" 
                    onClick={handleEliminarConfirmado}
                    disabled={isLoadingInternal}
                >
                    Eliminar
                </button>
                <button className="btn" onClick={() => handleCerrar(false)}>
                    Cancelar
                </button>
            </div>
        );
    } else if (dialogState === 'EXITO') {
        mensaje = `Los datos del huésped: ${huespedInfo} han sido eliminados del sistema.`;
        botonPrincipal = (
            <p style={{marginTop: '20px'}}>PRESIONE UNA TECLA PARA CONTINUAR...</p>
        );
    } else if (dialogState === 'ERROR_RESTRICCION') {
        mensaje = mensajeError; 
        botonPrincipal = (
            <p style={{marginTop: '20px'}}>PRESIONE UNA TECLA PARA CONTINUAR...</p>
        );
    }
    
    if (isConfirming || dialogState === 'EXITO' || dialogState === 'ERROR_RESTRICCION') {

        return (
            <div style={modalOverlayStyle}>
                <div style={modalContentStyle}>
                    <header style={headerStyle}>
                        <h1 style={{fontSize: '32px', color: '#B8975A'}}>{titulo}</h1>
                    </header>
                    
                    <main style={{ padding: '40px 20px', textAlign: 'center' }}>
                        
                        <div style={{ 
                            border: '3px solid #B8975A', 
                            padding: '20px', 
                            maxWidth: '450px', 
                            margin: '0 auto', 
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                        tabIndex={0} 
                        onKeyDown={(e) => {
                            if (dialogState === 'EXITO' || dialogState === 'ERROR_RESTRICCION') {
                                handleCerrar(dialogState === 'EXITO');
                            }
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px'}}>
                                {icono}
                                <p style={{color: 'white', fontSize: '18px', lineHeight: '1.4', fontWeight: 'bold'}}>{mensaje}</p>
                            </div>
                            {botonPrincipal}
                        </div>
                    </main>
                </div>
            </div>
        );
    }
    
    return null;
}

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#000000',
    border: '5px solid #A67C52',
    padding: '0',
    borderRadius: '0px',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 0 20px rgba(184, 151, 90, 0.8)',
};

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '20px 0', 
    borderBottom: '2px solid #B8975A',
    position: 'relative',
};