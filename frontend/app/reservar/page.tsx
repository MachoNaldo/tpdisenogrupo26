'use client';

import Encabezado from "./Encabezado";
import TablaDeInteraccion from "./TablaDeSeleccion";
import BotonCancelar from "../components/BotonCancelar";
import { Suspense } from "react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TablaPage() {
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

  return (
    <main className="min-h-screen flex flex-col items-center justify-start relative bg-black">

      <div className="absolute inset-0 bg-[url('/img/Fondo4.png')] bg-center bg-contain bg-no-repeat opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Contenedor principal */}
      <div className="relative  max-w-6x1 bg-black/60 mt-12 p-8 
                      rounded-xl border border-[#d6a85b]/40 shadow-2xl">

        <Encabezado />

        <div className="mt-6 flex flex-col">

          <Suspense fallback={<p>Cargando...</p>}>
            <TablaDeInteraccion />
          </Suspense>

          <div className="mt-6 w-full flex justify-end">
            <BotonCancelar />
          </div>

        </div>

      </div>
    </main>
  );
}
