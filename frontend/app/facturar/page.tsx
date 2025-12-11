"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReservarHabitacion() {
  const router = useRouter();

  const [habitacion, setHabitacion] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState<string | null>(null);

  const continuar = () => {
    if (!habitacion || !fecha) {
      setError("⚠️ Debes completar ambos campos.");
      return;
    }
    
    if (habitacion < "1"){
      setError("⚠️ Habitación inexistente.");
      return;
    }

    //router.push(`/reservar?desde=${habitacion}&hasta=${fecha}`);//CAMBIAR PARA QUE LLEVE A LA SIGUIENTE COSA DE FACTURAR(LA TABLA)
  };

  const cancelar = () => {
    router.push("/menu");
  };

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
          Elegir responsable de pago
        </h1>

        {/* Subtítulo */}
        <p className="text-lg font-[Georgia] mb-10 text-[#d6a85b] italic opacity-90">
          Ingresa un numero de habitación y la fecha de salida para<br />
          filtrar a los ocupantes de la habitación.
        </p>

        {/* Error */}
        {error && (
          <div className="text-red-400 mb-5 text-sm border border-red-400 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="flex justify-center gap-10 mb-10">

          {/* Numero de Habitación */}
          <div className="flex flex-col">
            <label className="text-[#d6a85b] font-[Georgia] mb-1 italic">
              Numero de Habitación

            </label>
            <input
              type="number"
              min="1"
              className="bg-transparent border border-[#d6a85b] text-white 
                         px-4 py-3 rounded-xl text-center w-[200px] 
                         font-[Georgia] focus:outline-none"
              value={habitacion}
              onChange={(e) => setHabitacion(e.target.value)}
            />
          </div>

          {/* Fecha de salida*/}
          <div className="flex flex-col">
            <label className="text-[#d6a85b] font-[Georgia] mb-1 italic">
              Fecha de salida
            </label>
            <input
              type="date"
              className="bg-transparent border border-[#d6a85b] text-white 
                         px-4 py-3 rounded-xl text-center w-[200px] 
                         font-[Georgia] focus:outline-none"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-center gap-25 mt-6">

            <button
              onClick={continuar}
              className="bg-[#a67c52] hover:bg-[#c39a4f] text-white px-12 py-3 rounded-xl 
                        font-[Georgia] text-xl shadow-md transition">
              Buscar
            </button>

            <button
              onClick={cancelar}
              className="bg-[#a67c52] hover:bg-[#c39a4f] text-white px-10 py-3 rounded-xl 
                        font-[Georgia] text-xl shadow-md transition">
              Cancelar
            </button>

        </div>
      </div>
    </main>
  );
}
