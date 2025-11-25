'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Menu() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<string | null>(null);

  useEffect(() => {
      const verificarSesion = async () => {
          try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/revisar-sesion`, {
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

  // Mantengo tu logout
  const desloguearse = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      router.push('/login');
    } catch (error) {
      router.push('/login');
    }
  };


  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">PREMIER</h1>
        <button onClick={desloguearse} className="logout-btn">
          Cerrar Sesión
        </button>
      </div>

      <div className="menu-content">
        <p className="welcome-text">Bienvenido {usuario}</p>

        <div className="menu-buttons">
          <Link href="/crearhuesped" className="menu-btn">
            Dar Alta de Huésped
          </Link>
          <Link href="/huespedes" className="menu-btn">
            Buscar Huésped
          </Link>
        </div>
      </div>
    </div>
  );
}
