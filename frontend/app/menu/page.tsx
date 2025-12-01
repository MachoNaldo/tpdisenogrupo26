'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import './menu.css';

export default function Menu() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<string | null>(null);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/revisar-sesion`, {
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

        setUsuario(data.usuario.nombre);
      } catch (err) {
        router.push('/login');
      }
    };

    verificarSesion();
  }, []);

  const desloguearse = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  return (
    <div className="menu-bg">
      <button className="menu-back" onClick={() => router.push('/inicio')}>
        ←
      </button>

      <Image 
        src="/img/Logotipo3.png"
        alt="Decoración"
        width={180}
        height={180}
        className="menu-corner-img"/>

      <div className="menu-container">
        <h1 className="menu-title font-serif italic">HOTEL PREMIER</h1>
        <p className="welcome font-serif italic">Bienvenido, {usuario}</p>

        <div className="menu-grid">

          {/* Buscar huesped */}
          <Link href="/huespedes" className="menu-card">
            <div className="icon-wrapper">
              <Image src="/img/LupaBus.png" alt="Buscar" width={80} height={80} className="menu-icon opacity-80" />
            </div>
            <p className="menu-label font-serif">Buscar Huésped</p>
          </Link>

          {/* Crear huesped */}
          <Link href="/crearhuesped" className="menu-card">
            <div className="icon-wrapper">
              <Image src="/img/AgregarHuesped.png" alt="Agregar" width={80} height={80} className="menu-icon opacity-80" />
            </div>
            <p className="menu-label font-serif">Agregar Huésped</p>
          </Link>

          {/* Reservar habitacion */}
          <Link href="/seleccionarFechas" className="menu-card">
            <div className="icon-wrapper">
              <Image src="/img/AlmanaqueReservar.png" alt="Reservar" width={80} height={80} className="menu-icon opacity-90" />
            </div>
            <p className="menu-label font-serif">Reservar Habitación</p>
          </Link>

          {/* Ocupar habitacion */}
          <Link href="/seleccionarFechasOcupar" className="menu-card">
            <div className="icon-wrapper">
              <Image src="/img/LlaveOcup.png" alt="Ocupar" width={90} height={80} className="menu-icon opacity-80" />
            </div>
            <p className="menu-label font-serif">Ocupar Habitación</p>
          </Link>

        </div>

        <button className="logout-btn font-serif" onClick={desloguearse}>Cerrar Sesión</button>
      </div>
    </div>
  );
}
