'use client';

import React, { useState } from 'react';

const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ModalCuitProps {
  huespedId: number;
  onClose: () => void;
  onSuccess: (cuit: string, condicionFiscal: string) => void;
}

function normalizarCuit(value: string): string {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
}

function cuitSoloDigitos(value: string): string {
  return (value ?? '').replace(/\D/g, '');
}

function esCuitValido11(value: string): boolean {
  return cuitSoloDigitos(value).length === 11;
}

export default function ModalCuit({ huespedId, onClose, onSuccess }: ModalCuitProps) {
  const [cuitMostrado, setCuitMostrado] = useState('');
  const [condicionFiscal, setCondicionFiscal] = useState<'MONOTRIBUTISTA' | 'RESPONSABLE_INSCRIPTO'>('MONOTRIBUTISTA');
  const [guardando, setGuardando] = useState(false);

  const handleGuardarCuit = async () => {
    const cuitDigitos = cuitSoloDigitos(cuitMostrado);
    
    if (!esCuitValido11(cuitDigitos)) {
      window.alert('Debe ingresar un CUIT válido de 11 dígitos');
      return;
    }

    setGuardando(true);

    try {
      const url = `${SPRING_BOOT_API_URL}/api/huespedes/${huespedId}`;
      
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cuit: cuitDigitos,
          condicionFiscal: condicionFiscal
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      window.alert('CUIT y condición fiscal actualizados correctamente');
      onSuccess(cuitDigitos, condicionFiscal);
      
    } catch (err) {
      console.error(err);
      window.alert('Error al actualizar el CUIT. Intente nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  const handleChangeCuit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormateado = normalizarCuit(e.target.value);
    setCuitMostrado(valorFormateado);
  };

  return (
    <div className="modal-superpuesto" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-encabezado">
          <h3>Ingresar CUIT y Condición Fiscal</h3>
        </div>
        
        <div className="modal-cuerpo">
          <div className="grupo-formulario">
            <label className="etiqueta-formulario">CUIT (11 dígitos)</label>
            <input
              type="text"
              placeholder="20-12345678-9"
              value={cuitMostrado}
              onChange={handleChangeCuit}
              maxLength={13}
              className="entrada-formulario"
            />
          </div>
          
          <div className="grupo-formulario">
            <label className="etiqueta-formulario">Condición Fiscal</label>
            <select
              value={condicionFiscal}
              onChange={(e) => setCondicionFiscal(e.target.value as any)}
              className="selector-formulario"
            >
              <option value="MONOTRIBUTISTA">Monotributista</option>
              <option value="RESPONSABLE_INSCRIPTO">Responsable Inscripto</option>
            </select>
          </div>
        </div>
        
        <div className="modal-acciones">
          <button 
            className="btn" 
            onClick={handleGuardarCuit}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          <button 
            className="btn" 
            onClick={onClose}
            disabled={guardando}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}