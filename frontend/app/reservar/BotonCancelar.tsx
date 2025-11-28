"use client";

import { useRouter } from "next/navigation";

export default function BotonCancelar() {

  const router = useRouter();

  const volverASeleccion = () => {
    router.push("/menu");
  };

  return (
    <button
      onClick={volverASeleccion}
      className="bg-[#a67c52] text-white px-8 py-2 rounded-2xl text-2xl shadow-md 
                 hover:bg-[#c39a4f] transition font-[Georgia] font-bold"
    >
      Cancelar
    </button>
  );
}
