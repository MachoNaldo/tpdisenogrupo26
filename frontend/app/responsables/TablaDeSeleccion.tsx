"use client";

import { useEffect, useState } from "react";

//import { useSearchParams } from "next/navigation";

import EstructuraDeTabla, { Estados } from "./EstructuraDeTabla";

interface Huesped {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  email?: string;
}


export default function TablaDeHuespedes() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [huesped, setHuesped] = useState<Huesped | null>(null);

  // Seleccion
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const getNombreCompleto = (h: Huesped) => `${h.nombre} ${h.apellido}`;
  
  //BACKEND
  async function cargarHuespedes() {
    
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/`
      );

      if (!res.ok) throw new Error("Error al obtener huéspedes");

      const data: Huesped = await res.json();
      setHuesped(data);

    } catch (e) {
      console.error("Error cargando huéspedes:", e);
      setError("No se pudo cargar la lista de huéspedes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarHuespedes();
  }, []);

function seleccionarHuesped(
    d: number,
    typeId: string,
    roomNumber: number,
    e: React.MouseEvent
  ) {
    const k = keyOf(d, typeId, roomNumber);


    setSelected((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });

    setLastSelected({ dateIndex: d, typeId, roomNumber });
  }

  const quitarSeleccionados = () => {
    setSelected(new Set());
  };
 const handleSelect = (huesped: Huesped) => {
  const nuevoNombre = getNombreCompleto(huesped);

  setSelectedName((prev) => {
    // Lógica de Toggle: Si ya es ese, quítalo. Si no, ponlo.
    return prev === nuevoNombre ? null : nuevoNombre;
  });
 };



  const reservar = async () => {
    if (selected.size === 0) {
      setError("⚠ Debes seleccionar al menos una celda.");
      return;
    }

    const reservasParaEnviar: any[] = [];

      const fecha = dates[dIndex];

      reservasParaEnviar.push({
        numeroHabitacion: roomNum,
        fechaInicio: fecha,
        fechaFin: fecha,
      });
    }

    const payload = {
      cliente: {
        nombre: "Reserva Web",
        apellido: "Online",
        telefono: "0000",
      },
      reservas: reservasParaEnviar,
    };

    console.log("👉 JSON enviado al backend:");
    console.log(JSON.stringify(payload, null, 2));

    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        setError("⚠ Error al reservar.");
        return;
      }

      await cargarDatos();
      setSelected(new Set());
      setError(null);
    } catch (e) {
      console.error("❌ ERROR en fetch:", e);
      setError("⚠ No se pudo conectar.");
    }
  };


  if (loading)
    return (
      <p className="text-[#d6a85b] text-2xl font-serif mt-10">
        Cargando disponibilidad...
      </p>
    );

  return (
    <div className="w-full mt-4 flex flex-col items-center">
      {error && (
        <div className="text-white bg-red-700 px-4 py-2 rounded mb-3 italic">
          {error}
        </div>
      )}

      <div className="w-full border-[6px] border-[#a67c52] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full table-fixed border-collapse">
          <thead className="text-black font-bold">
            <tr className="bg-[#f5f5f5]">
              <th className="bg-[#b18b45] border-2 p-2 w-[140px]">
                Periodo / Tipo
              </th>

              {roomTypes.map((t) => (
                <th key={t.tipo} className="border-2 p-2 w-[140px]">
                  {t.tipo}
                </th>
              ))}

              <th className="w-[17px] bg-[#555353]"></th>
            </tr>

            <tr className="bg-[#848282]">
              <th className="border-2 p-2 text-center">N° Habitación</th>

              {roomTypes.map((t) => (
                <th key={t.tipo} className="border-2 p-2 text-center">
                  <select
                    className="w-1/2 bg-white border-2 rounded"
                    value={selectedRoomByType[t.tipo]}
                    onChange={(e) =>
                      setSelectedRoomByType((p) => ({
                        ...p,
                        [t.tipo]: Number(e.target.value),
                      }))
                    }
                  >
                    {t.habitaciones.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </th>
              ))}

              <th className="bg-[#555353]"></th>
            </tr>
          </thead>
        </table>

        <div className="max-h-[260px] overflow-y-auto">
          <table className="w-full table-fixed border-collapse">
            <tbody>
              {dates.map((date, dIndex) => (
                <tr key={date}>
                  <td className="border-2 bg-gray-200 text-center font-semibold">
                    {date}
                  </td>

                  {roomTypes.map((t) => {
                    const hab = selectedRoomByType[t.tipo];
                    const estado =
                      availability[t.tipo]?.[hab]?.[dIndex] || "LIBRE";

                    return (
                       <EstructuraDeTabla
                        key={`${t.tipo}-${hab}-${dIndex}`}
                        value={estado}
                        isSelected={selected.has(
                          keyOf(dIndex, t.tipo, hab)
                        )}
                        onClick={(e) =>
                          seleccionarCelda(dIndex,t.tipo, hab, e)
                        }
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 w-full flex items-center">
        <div className="flex-1 flex justify-center">
          <button
            disabled={selected.size === 0}
            onClick={reservar}
            className={`px-8 py-3 rounded-2xl text-xl font-bold shadow ${
              selected.size === 0
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-[#a67c52] hover:bg-[#c39a4f] text-white"
            }`}
          >
            Reservar
          </button>
        </div>

        <div className="flex-1 flex justify-end">
          {selected.size > 0 && (
            <button
              onClick={quitarSeleccionados}
              className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow"
            >
              Quitar seleccionados
            </button>

          )}
        </div>
      </div>
    </div>
  );
}
