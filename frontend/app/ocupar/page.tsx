import Encabezado from "./Encabezado";
import TablaDeInteraccion from "./TablaDeSeleccion";
import BotonCancelar from "../reservar/BotonCancelar";

export default function TablaPage() {

  return (
    <main className="min-h-screen flex flex-col items-center justify-start relative bg-black">

      {/* Imagen atras */}
      <div className="absolute inset-0 bg-[url('/img/Fondo4.png')] bg-center bg-contain bg-no-repeat
                   opacity-50 pointer-events-none" />


      {/* Capa oscura encima */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Contenedor principal */}
      <div className="relative w-full max-w-6xl bg-black/60 mt-12 p-8 
                      rounded-xl border border-[#d6a85b]/40 shadow-2xl">

        <Encabezado />

        <div className="mt-6 flex flex-col">
          <TablaDeInteraccion />
          {/* Botón Cancelar */}
          <div className="mt-6 w-full flex justify-end">
            <BotonCancelar />
          </div>
        </div>

      </div>
    </main>
  );
}
