'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import './tercero.css';

const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL;

const MENSAJE_ERROR_CUIT =
  'Error: "CUIT no válido.\nPor favor complete el campo correctamente."';

type PersonaApi = {
  id?: number;
  cuit?: string;
  tipo?: string; // "HUESPED" o "RESPONSABLE_PAGO"
  documentacion?: string;
  razonSocial?: string;
  nombres?: string;
  apellido?: string;
  telefono?: string;
  nacionalidad?: string;
  tipoDocumento?: string;
};

function normalizarCuit(value: string): string {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
}

function esCuitValido(value: string): boolean {
  return (value ?? '').replace(/\D/g, '').length === 11;
}

export default function FacturarTerceroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const habitacion = searchParams.get('habitacion') ?? '';
  const fecha = searchParams.get('fecha') ?? '';

  const [cuit, setCuit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [personaEncontrada, setPersonaEncontrada] = useState<PersonaApi | null>(null);

  const cuitRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        if (!SPRING_BOOT_API_URL) {
          router.push('/login');
          return;
        }

        const res = await fetch(`${SPRING_BOOT_API_URL}/revisar-sesion`, {
          credentials: 'include',
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        if (!data.autenticado) router.push('/login');
      } catch {
        router.push('/login');
      }
    };

    verificarSesion();
  }, [router]);

  const puedeConfirmar = useMemo(() => esCuitValido(cuit), [cuit]);

  const cerrarModal = () => {
    setMostrarModal(false);
    setPersonaEncontrada(null);
  };

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cuitTrim = cuit.trim();
    const cuitDigits = (cuitTrim ?? '').replace(/\D/g, '');

    if (!cuitTrim || !esCuitValido(cuitTrim)) {
      setError(MENSAJE_ERROR_CUIT);
      cuitRef.current?.focus();
      return;
    }

    if (!SPRING_BOOT_API_URL) {
      setError('Error de configuración del sistema.');
      return;
    }

    setLoading(true);
    try {
      // Endpoint unificado - busca en ambas tablas
      const url = `${SPRING_BOOT_API_URL}/api/personas/buscar-por-cuit?cuit=${encodeURIComponent(
        cuitDigits
      )}`;

      const res = await fetch(url, { credentials: 'include' });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 404) {
          setError('No se encontró ninguna persona con el CUIT ingresado.');
          return;
        }
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data: PersonaApi = await res.json();

      const cuitBackend = data.cuit ?? data.documentacion ?? cuitTrim;

      // Construir nombre según el tipo encontrado
      let nombreMostrar = '';
      if (data.tipo === 'HUESPED') {
        nombreMostrar = `${data.apellido ?? ''} ${data.nombres ?? ''}`.trim();
        if (!nombreMostrar) {
          setError('La persona encontrada no tiene nombre registrado.');
          return;
        }
      } else if (data.tipo === 'RESPONSABLE_PAGO') {
        nombreMostrar = data.razonSocial ?? '';
        if (!nombreMostrar) {
          setError('La persona encontrada no tiene Razón Social registrada.');
          return;
        }
      }

      setPersonaEncontrada({
        ...data,
        cuit: cuitBackend,
        razonSocial: nombreMostrar,
      });

      setMostrarModal(true);
    } catch (err) {
      console.error(err);
      setError('Error al buscar persona.');
    } finally {
      setLoading(false);
    }
  };

  const handleAceptarModal = () => {
    if (!personaEncontrada?.id || !personaEncontrada?.tipo) {
      setError('Los datos de la persona no son válidos.');
      cerrarModal();
      return;
    }

    if (!habitacion || !fecha) {
      setError('Faltan datos del proceso de facturación.');
      cerrarModal();
      return;
    }

    // Navegar según el tipo encontrado
    if (personaEncontrada.tipo === 'HUESPED') {
      // Para huésped: pasar responsable + responsablePagoId + datos
      const razonSocial = `${personaEncontrada.apellido ?? ''} ${personaEncontrada.nombres ?? ''}`.trim();
      
      router.push(
        `/facturar/detalle?` +
        `habitacion=${encodeURIComponent(habitacion)}&` +
        `fecha=${encodeURIComponent(fecha)}&` +
        `responsable=${encodeURIComponent(String(personaEncontrada.id))}&` +
        `personaId=${encodeURIComponent(String(personaEncontrada.id))}&` +
        `cuit=${encodeURIComponent(personaEncontrada.cuit || '')}&` +
        `razonSocial=${encodeURIComponent(razonSocial)}&` +
        `telefono=${encodeURIComponent(personaEncontrada.telefono || '')}&` +
        `nacionalidad=${encodeURIComponent(personaEncontrada.nacionalidad || '')}&` +
        `tipoDocumento=${encodeURIComponent(personaEncontrada.tipoDocumento || '')}&` +
        `documentacion=${encodeURIComponent(personaEncontrada.documentacion || '')}`
      );
    } else if (personaEncontrada.tipo === 'RESPONSABLE_PAGO') {
      // Para responsable de pago: pasar responsablePagoId + datos (sin responsable)
      router.push(
        `/facturar/detalle?` +
        `habitacion=${encodeURIComponent(habitacion)}&` +
        `fecha=${encodeURIComponent(fecha)}&` +
        `personaId=${encodeURIComponent(String(personaEncontrada.id))}&` +
        `cuit=${encodeURIComponent(personaEncontrada.cuit || '')}&` +
        `razonSocial=${encodeURIComponent(personaEncontrada.razonSocial || '')}&` +
        `telefono=${encodeURIComponent(personaEncontrada.telefono || '')}&` +
        `nacionalidad=${encodeURIComponent(personaEncontrada.nacionalidad || '')}&` +
        `tipoDocumento=${encodeURIComponent(personaEncontrada.tipoDocumento || '')}&` +
        `documentacion=${encodeURIComponent(personaEncontrada.documentacion || '')}`
      );
    }
  };

  const handleCancelar = () => {
    router.push('/facturar');
  };

  return (
    <div className="tercero-bg">
      <header className="tercero-header">
        <h1 className="tercero-header-title">Facturar a nombre de tercero</h1>
        <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} />
      </header>

      <main className="tercero-form-container">
        <form onSubmit={handleConfirmar}>
          
          <div className="tercero-form-row">
            <label className="tercero-label">CUIT</label>
            <input
              ref={cuitRef}
              className="tercero-input"
              type="text"
              placeholder="##-########-#"
              value={cuit}
              onChange={(e) => {
                setCuit(normalizarCuit(e.target.value));
                setError(null);
              }}
            />
          </div>

          {error && (
            <div className="error-box">
              <div className="error-icon">
                <Image src="/img/iconoError.svg" alt="icono" width={40} height={40} />
              </div>
              <p className="error-text">{error}</p>
            </div>
          )}

          <div className="tercero-buttons">
            <button className="tercero-btn" type="submit" disabled={loading || !puedeConfirmar}>
              {loading ? 'Buscando...' : 'Confirmar'}
            </button>

            <button
              className="tercero-btn"
              type="button"
              onClick={() => router.push('/agregarRDP')}
              disabled={loading}
            >
              Dar alta responsable de pago
            </button>

            <button className="tercero-btn" type="button" onClick={handleCancelar} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>
      </main>

      {mostrarModal && personaEncontrada && (
        <div className="tercero-modal-overlay">
          <div className="tercero-modal">
            <h3 className="tercero-modal-titulo">
              {personaEncontrada.tipo === 'HUESPED' ? 'Huésped encontrado' : 'Responsable de Pago encontrado'}
            </h3>

            <div className="tercero-modal-row">
              <div className="tercero-modal-label text-center">CUIT</div>
              <div className="tercero-modal-box">{personaEncontrada.cuit}</div>
            </div>

            <div className="tercero-modal-row">
              <div className="tercero-modal-label text-center">
                {personaEncontrada.tipo === 'HUESPED' ? 'Nombre' : 'Razón Social'}
              </div>
              <div className="tercero-modal-box">{personaEncontrada.razonSocial}</div>
            </div>

            <div className="tercero-modal-actions">
              <button className="btn" onClick={handleAceptarModal}>
                Aceptar
              </button>
              <button className="btn" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}