"use client";

import { useRouter } from "next/navigation";

export default function BotonCancelar() {

  const router = useRouter();

  const volverASeleccion = () => {
    router.push("/menu");
  };

  return (
    <button onClick={volverASeleccion} className="btn">
      Cancelar
    </button>
  );
}