"use client";

export type Estados = "Libre" | "Reservada" | "Ocupada" | "Fuera de Servicio";

interface Props {
  value: Estados;
  isSelected: boolean;
  onClick: () => void;
}


//Colores de las celdas
export default function EstructuraDeTabla({ value, isSelected, onClick }: Props) {
  const base =
    "text-center border border-gray-700 py-2 font-medium cursor-pointer transition";

  const stateBg =
    value === "Fuera de Servicio"
      ? "bg-[#F7FF07] text-black"
      : value === "Reservada"
      ? "bg-[#DE6767] text-black"
      : value === "Ocupada"
      ? "bg-[#d32f2f] text-black"
      : "bg-[#37CE53] text-black";

  //cuando se pinta azul
  const finalBg = isSelected ? "bg-blue-500  text-black" : stateBg;

  return (
    <td onClick={onClick} className={`${base} ${finalBg}`}>
      {value}
    </td>
  );
}
