"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ReservarHabitacion() {
  const router = useRouter();

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [error, setError] = useState<string | null>(null);

  const continuar = () => {
    if (!desde || !hasta) {
      setError("Debes seleccionar ambas fechas.");
      return;
    }

    if (new Date(desde) > new Date(hasta)) {
      setError("La fecha 'Desde' no puede ser mayor que 'Hasta'.");
      return;
    }

    router.push(`/reservar?desde=${desde}&hasta=${hasta}`);

  };

  const cancelar = () => {
    router.push("/menu");
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative text-white bg-black">


      {/* Imagen de Fondo*/}
      <div className="absolute inset-0 bg-[url('/img/Fondo4.png')] 
                      bg-center bg-contain bg-no-repeat opacity-40 pointer-events-none" />

      {/* Fondo oscuro encima */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Marco principal */}
      <div className="relative bg-black/60 border border-[#d6a85b] rounded-xl 
                      shadow-2xl px-14 py-10 w-[650px] text-center">

        {/* Título */}
        <h1 className="text-5xl font-[Georgia] text-[#d6a85b] mb-4 italic">
          Buscar habitación
        </h1>

        {/* Subtítulo */}
        <p className="text-lg font-[Georgia] mb-10 text-[#d6a85b] italic opacity-90">
          Ingresa una fecha de inicio y fin para revisar la<br />
          disponibilidad de las habitaciones.
        </p>

        {/* Error */}
        {error && (
          <div className="error-box">
                      <div className="error-icon">
                        <Image src="img/iconoError.svg" alt="icono" width={40} height={40} />
                      </div>
                      <p className="error-text">
                       {error}
                      </p>
                    </div>
        )}

        {/* Inputs */}
        <div className="flex justify-center gap-10 mb-10">

          {/* Fecha desde */}
          <div className="flex flex-col">
            <label className="text-[#d6a85b] font-[Georgia] mb-1 italic">
              Desde Fecha
            </label>
            <input type="date" 
            className="bg-transparent border border-[#d6a85b] text-white px-4 py-3 
                      rounded-xl text-center w-[200px] font-[Georgia] focus:outline-none"
              value={desde} onChange={(e) => setDesde(e.target.value)}/>
          </div>

          {/* Fecha hasta */}
          <div className="flex flex-col">
            <label className="text-[#d6a85b] font-[Georgia] mb-1 italic">
              Hasta Fecha
            </label>
            <input
              type="date"
              className="bg-transparent border border-[#d6a85b] text-white px-4 py-3
                         rounded-xl text-center w-[200px] font-[Georgia] focus:outline-none"
              value={hasta} onChange={(e) => setHasta(e.target.value)}/>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-25 mt-6">

            <button className="btn" onClick={continuar} >
              Buscar
            </button>

            <button
              onClick={cancelar}
              className="btn">
              Cancelar
            </button>

        </div>
      </div>
    </main>
  );
}
