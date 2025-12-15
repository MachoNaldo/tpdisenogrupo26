'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import './tercero.css';


const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Debe devolver un ResponsablePago por CUIT
const ENDPOINT_BUSCAR_RESPONSABLE = '/api/responsablespago/buscar-por-cuit';


const MENSAJE_ERROR_CUIT =
  'Error: “CUIT no válido.\nPor favor complete el campo correctamente.”';

type ResponsablePagoApi = {
  id?: number;
  cuit?: string;
  documentacion?: string;
  razonSocial?: string;
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
  const [responsablePago, setResponsablePago] = useState<ResponsablePagoApi | null>(null);

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
    setResponsablePago(null);
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
      const url = `${SPRING_BOOT_API_URL}${ENDPOINT_BUSCAR_RESPONSABLE}?cuit=${encodeURIComponent(
        cuitDigits
      )}`;

      const res = await fetch(url, { credentials: 'include' });

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (res.status === 404) {
          setError('No existe un Responsable de Pago para el CUIT ingresado.');
          return;
        }
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data: ResponsablePagoApi = await res.json();

      const cuitBackend = data.cuit ?? data.documentacion ?? cuitTrim;
      const razon = data.razonSocial;

      if (!razon) {
        setError('El Responsable de Pago no tiene Razón Social registrada.');
        return;
      }

      setResponsablePago({
        ...data,
        cuit: cuitBackend,
        razonSocial: razon,
      });

      setMostrarModal(true);
    } catch (err) {
      console.error(err);
      setError('Error al buscar Responsable de Pago.');
    } finally {
      setLoading(false);
    }
  };

  const handleAceptarModal = () => {
    if (!responsablePago?.id) {
      setError('El Responsable de Pago no tiene un ID válido.');
      cerrarModal();
      return;
    }

    if (!habitacion || !fecha) {
      setError('Faltan datos del proceso de facturación.');
      cerrarModal();
      return;
    }

    router.push(
      `/facturar/detalle?habitacion=${encodeURIComponent(habitacion)}&fecha=${encodeURIComponent(
        fecha
      )}&responsablePagoId=${encodeURIComponent(String(responsablePago.id))}`
    );
  };

  const handleCancelar = () => {
    router.push('/facturar');
  };

  return (
    <div className="tercero-bg">
      <header className="tercero-header">
        <h1 className="tercero-header-title">Facturar a nombre de tercero</h1>
        <Image src="/img/iconoError.svg" alt="icono" width={40} height={40} />

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

          {error  && ( <div className="error-box">
            <div className="error-icon">
              <Image src="img/iconoError.svg" alt="icono" width={40} height={40} />
              </div>
              <p className="error-text">
              {error}
              </p>
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

      {mostrarModal && responsablePago && (
        <div className="tercero-modal-overlay">
          <div className="tercero-modal">
            <div className="tercero-modal-row">
              <div className="tercero-modal-label text-center">CUIT</div>
              <div className="tercero-modal-box">{responsablePago.cuit}</div>
            </div>

            <div className="tercero-modal-row">
              <div className="tercero-modal-label text-center">Razón Social</div>
              <div className="tercero-modal-box">{responsablePago.razonSocial}</div>
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
