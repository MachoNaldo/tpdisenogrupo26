import Encabezado from "../components/Encabezado";
import TablaDeInteraccion from "../components/TablaDeSeleccion";
import BotonCancelar from "../components/BotonCancelar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start from-black to-neutral-900 relative">
      {/* Sello detrás */}
      <div className="absolute inset-0 bg-[url('/imagenes/Fondo4.png')] bg-center bg-contain bg-no-repeat
                   opacity-20 pointer-events-none"/>

      {/* Capa oscura encima del fondo (para efecto elegante) */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      {/* Contenedor principal */}
      <div className="relative w-full max-w-6xl bg-black/60 mt-12 p-8 rounded-xl border border-[#d6a85b]/40 shadow-2xl">
        <Encabezado/>
        <div className="mt-6 flex flex-col items-center">
          <TablaDeInteraccion />
          <div className="mt-6">
            <BotonCancelar />
          </div>
        </div>
      </div>
    </main>
  );
}
