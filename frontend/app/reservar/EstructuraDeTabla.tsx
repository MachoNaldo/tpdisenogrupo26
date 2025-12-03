"use client";

export type Estados = "LIBRE" | "RESERVADO" | "OCUPADO" | "FUERA_SERVICIO";

function formatear(txt: string): string {
  // Convertimos a minúsculas excepto la primera letra
  txt = txt.toLowerCase();

  // Manejo especial para "FUERA_DE_SERVICIO"
  if (txt.includes("fuera")) {
    return "Fuera de servicio";
  }

  // Capitalizar
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}


interface Props {
  value: Estados;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export default function EstructuraDeTabla({ value, isSelected, onClick }: Props) {
  const base =
    "text-center border-3 py-2 font-bold cursor-pointer transition italic";

  const stateBg =
    value === "FUERA_SERVICIO"
      ? "bg-[#F7FF07] text-black"
    : value === "LIBRE"
      ? "bg-[#37CE53] text-black"
      : value === "RESERVADO"
      ? "bg-[#DE6767] text-black"
      : value === "OCUPADO"
      ? "bg-[#d32f2f] text-black"
      : "bg-[#F7FF07] text-black";

  const finalBg = isSelected ? "bg-blue-500 text-black" : stateBg;

  return (
    <td onClick={onClick} className={`${base} ${finalBg}`}>{formatear(value)}</td>
  );
}
