"use client";

export default function BotonCancelar() {
  return (
    <button
      onClick={() => console.log("Cancelar")}
      className="
        bg-[#a67c52] text-white 
        px-10 py-3 
        rounded-full text-xl 
        shadow-md 
        hover:bg-[#8f6844] 
        transition
      "
    >
      Cancelar
    </button>
  );
}
