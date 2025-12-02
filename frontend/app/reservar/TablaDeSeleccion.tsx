"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import EstructuraDeTabla, { Estados } from "./EstructuraDeTabla";
import ResumenReserva from "./ResumenReserva";


interface DisponibilidadDTO {
  numeroHabitacion: number;
  tipoHabitacion: string;
  estadoPorFecha: Record<string, Estados>;
}

type RoomType = {
  tipo: string;
  habitaciones: number[];
};

export default function TablaDeInteraccion() {
  const searchParams = useSearchParams();
  const desdeParam = searchParams.get("desde");
  const hastaParam = searchParams.get("hasta");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [availability, setAvailability] = useState<
    Record<string, Record<number, Estados[]>>
  >({});
  const [dates, setDates] = useState<string[]>([]);

  const [selectedRoomByType, setSelectedRoomByType] = useState<
    Record<string, number>
  >({});

  // Seleccion
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastSelected, setLastSelected] = useState<any>(null);

  // Datos del cliente
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteApellido, setClienteApellido] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");

  const keyOf = (d: number, typeId: string, room: number) =>
    `${d}-${typeId}-${room}`;

  const [confirmando, setConfirmando] = useState(false);
  const [resumen, setResumen] = useState<any[]>([]);


  //BACKEND
  async function cargarDatos() {
    if (!desdeParam || !hastaParam) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/habitaciones/disponibilidad?desde=${desdeParam}&hasta=${hastaParam}`
      );

      const data: DisponibilidadDTO[] = await res.json();

      // Fechas del rango
      const desde = new Date(desdeParam);
      const hasta = new Date(hastaParam);

      const dts: string[] = [];
      let act = new Date(desde);

      while (act <= hasta) {
        dts.push(act.toISOString().split("T")[0]);
        act.setDate(act.getDate() + 1);
      }

      setDates(dts);

      // Agrupo tipos
      const tiposMap: Record<string, number[]> = {};

      for (const h of data) {
        if (!tiposMap[h.tipoHabitacion]) tiposMap[h.tipoHabitacion] = [];
        tiposMap[h.tipoHabitacion].push(h.numeroHabitacion);
      }

      const tipos = Object.entries(tiposMap).map(([tipo, habitaciones]) => ({
        tipo,
        habitaciones,
      }));

      // Preseleccionar por defecto la 1ra habitación de cada tipo
      const preSel: Record<string, number> = {};
      tipos.forEach((t) => {
        preSel[t.tipo] = t.habitaciones[0];
      });

      setSelectedRoomByType(preSel);
      setRoomTypes(tipos);

      const avail: Record<string, Record<number, Estados[]>> = {};

      for (const hab of data) {
        if (!avail[hab.tipoHabitacion]) avail[hab.tipoHabitacion] = {};

        const estadoMap: Record<string, Estados | string> =
          (hab as any).estadoPorFecha ??
          (hab as any).estados ??
          {};

        const arr = dts.map((f) => (estadoMap[f] as Estados) || "LIBRE");
        avail[hab.tipoHabitacion][hab.numeroHabitacion] = arr;
      }

      setAvailability(avail);
    } catch (e) {
      console.error("Error cargando disponibilidad:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, [desdeParam, hastaParam]);

  function seleccionarCelda(
    d: number,
    typeId: string,
    roomNumber: number,
    e: React.MouseEvent
  ) {
    const k = keyOf(d, typeId, roomNumber);

    if (e.shiftKey && lastSelected) {
      if (
        lastSelected.typeId === typeId &&
        lastSelected.roomNumber === roomNumber
      ) {
        const i1 = Math.min(lastSelected.dateIndex, d);
        const i2 = Math.max(lastSelected.dateIndex, d);

        setSelected((prev) => {
          const next = new Set(prev);
          for (let i = i1; i <= i2; i++) next.add(keyOf(i, typeId, roomNumber));
          return next;
        });

        return;
      }
    }

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

  const reservar = async () => {
  if (selected.size === 0) {
    setError("⚠ Debes seleccionar al menos una celda.");
    return;
  }

  if (!clienteNombre.trim() || !clienteApellido.trim() || !clienteTelefono.trim()) {
    setError("⚠ Debes completar todos los datos del cliente.");
    return;
  }

  // Agrupar selecciones por habitación
  const porHabitacion: Record<number, number[]> = {};

  for (const k of selected) {
    const [dIndexStr, typeId, roomStr] = k.split("-");
    const dIndex = Number(dIndexStr);
    const roomNum = Number(roomStr);

    if (!porHabitacion[roomNum]) porHabitacion[roomNum] = [];
    porHabitacion[roomNum].push(dIndex);
  }

  const reservasRango: any[] = [];

  // Agrupar consecutivos
  for (const [roomNumStr, indices] of Object.entries(porHabitacion)) {
    const roomNum = Number(roomNumStr);
    const sorted = indices.sort((a, b) => a - b);

    let inicio = sorted[0];
    let fin = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === fin + 1) {
        fin = sorted[i];
      } else {
        reservasRango.push({
          numeroHabitacion: roomNum,
          fechaInicio: dates[inicio],
          fechaFin: dates[fin],
        });
        inicio = fin = sorted[i];
      }
    }

    reservasRango.push({
      numeroHabitacion: roomNum,
      fechaInicio: dates[inicio],
      fechaFin: dates[fin],
    });
  }

  // Agregar tipoHabitacion a cada rango
  const resumenCompleto = reservasRango.map((r) => {
    const tipoHab = Object.entries(availability).find(([tipo, rooms]) =>
      rooms[r.numeroHabitacion]
    )?.[0] ?? "Desconocido";

    return {
      ...r,
      tipoHabitacion: tipoHab,
    };
  });

  setResumen(resumenCompleto);
  setConfirmando(true);
};

  if (loading)
    return (
      <p className="text-[#d6a85b] text-2xl font-serif mt-10">
        Cargando disponibilidad...
      </p>
    );
    if (confirmando) {
  return (
    <ResumenReserva
      reservas={resumen}
      cliente={{
        nombre: clienteNombre,
        apellido: clienteApellido,
        telefono: clienteTelefono,
      }}
      onAceptar={async () => {
        // acá sí llamás al backend
        const payload = {
          cliente: {
            nombre: clienteNombre,
            apellido: clienteApellido,
            telefono: clienteTelefono,
          },
          reservas: resumen.map(r => ({
            numeroHabitacion: r.numeroHabitacion,
            fechaInicio: r.fechaInicio,
            fechaFin: r.fechaFin
          }))
        };

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reservas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        setConfirmando(false);
        setSelected(new Set());
        setClienteNombre("");
        setClienteApellido("");
        setClienteTelefono("");
        cargarDatos();
      }}
      onRechazar={() => setConfirmando(false)}
    />
  );
}

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
                          seleccionarCelda(dIndex, t.tipo, hab, e)
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
            className={`px-8 py-3 rounded-2xl text-xl font-bold shadow ${selected.size === 0
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

      {selected.size > 0 && (
        <div className=" bg-black mt-8 w-full max-w-2xl mx-auto bg-[#000000 border-4 border-[#a67c52] rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-[#a67c52] mb-4 text-center">
            Datos del Cliente
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[#a67c52] font-semibold mb-2">
                Nombre:
              </label>
              <input
                type="text"
                value={clienteNombre}
                onChange={(e) => setClienteNombre(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#a67c52] focus:outline-none"
                placeholder="Ingrese el nombre"
              />
            </div>

            <div>
              <label className="block text-[#a67c52] font-semibold mb-2">
                Apellido:
              </label>
              <input
                type="text"
                value={clienteApellido}
                onChange={(e) => setClienteApellido(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#a67c52] focus:outline-none"
                placeholder="Ingrese el apellido"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Teléfono:
              </label>
              <input
                type="tel"
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#a67c52] focus:outline-none"
                placeholder="Ingrese el teléfono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}