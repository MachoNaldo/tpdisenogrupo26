"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeleccionarFechas() {
  const router = useRouter();

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [error, setError] = useState<string | null>(null);

  const continuar = () => {
    if (!desde || !hasta) {
      setError("⚠️ Debes seleccionar ambas fechas.");
      return;
    }

    if (new Date(desde) > new Date(hasta)) {
      setError("⚠️ La fecha 'Desde' no puede ser mayor que 'Hasta'.");
      return;
    }

    router.push(`/ocupar?desde=${desde}&hasta=${hasta}`);





  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">

      <div className="bg-black/60 p-10 rounded-xl shadow-xl border border-[#d6a85b] w-[400px]">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#d6a85b]">
          Seleccionar rango de fechas
        </h1>

        {error && (
          <div className="text-red-400 mb-4 text-sm border border-red-400 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <label className="block mb-4 font-semibold">
          Fecha desde:
          <input
            type="date"
            className="w-full mt-1 bg-gray-200 text-black p-2 rounded"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </label>

        <label className="block mb-6 font-semibold">
          Fecha hasta:
          <input
            type="date"
            className="w-full mt-1 bg-gray-200 text-black p-2 rounded"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
        </label>

        <button
          onClick={continuar}
          className="w-full bg-[#a67c52] hover:bg-[#c39a4f] transition text-white font-semibold py-2 rounded-xl">
          Continuar
        </button>
      </div>
    </main>
  );
}
