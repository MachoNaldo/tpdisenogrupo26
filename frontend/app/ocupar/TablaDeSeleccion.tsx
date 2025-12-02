"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import EstructuraDeTabla, { Estados } from "./EstructuraDeTabla";

interface DisponibilidadDTO {
  numeroHabitacion: number;
  tipoHabitacion: string;
  estadoPorFecha: Record<string, Estados>;
}

type RoomType = {
  tipo: string;
  habitaciones: number[];
};

interface HabitacionSeleccionada {
  numeroHabitacion: number;
  tipoHabitacion: string;
  fechaInicio: string;
  fechaFin: string;
}

export default function TablaDeInteraccion() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

  // Modal de reservas
  const [modalReservas, setModalReservas] = useState<
    Array<{
      numeroHabitacion: number;
      fechaInicio: string;
      fechaFin: string;
      clienteNombre: string;
      clienteApellido: string;
    }>
  >([]);

  const keyOf = (d: number, typeId: string, room: number) =>
    `${d}-${typeId}-${room}`;

  //BACKEND
  async function cargarDatos() {
    if (!desdeParam || !hastaParam) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/habitaciones/disponibilidad?desde=${desdeParam}&hasta=${hastaParam}`
      );

      const datos: DisponibilidadDTO[] = await res.json();

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

      for (const h of datos) {
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

      for (const hab of datos) {
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
    numeroHabitacion: number,
    e: React.MouseEvent
  ) {
    const k = keyOf(d, typeId, numeroHabitacion);

    if (e.shiftKey && lastSelected) {
      if (
        lastSelected.typeId === typeId &&
        lastSelected.numeroHabitacion === numeroHabitacion
      ) {
        const i1 = Math.min(lastSelected.dateIndex, d);
        const i2 = Math.max(lastSelected.dateIndex, d);

        setSelected((prev) => {
          const next = new Set(prev);
          for (let i = i1; i <= i2; i++) next.add(keyOf(i, typeId, numeroHabitacion));
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

    setLastSelected({ dateIndex: d, typeId, numeroHabitacion });
  }

  const quitarSeleccionados = () => {
    setSelected(new Set());
  };

  const mostrarAlertaReservas = async (
    habitacionesReservadas: Array<{
      numeroHabitacion: number;
      fecha: string;
      typeId: string;
    }>
  ) => {
    const porHabitacion: Record<
      number,
      { fechas: string[]; typeId: string }
    > = {};

    for (const h of habitacionesReservadas) {
      if (!porHabitacion[h.numeroHabitacion]) {
        porHabitacion[h.numeroHabitacion] = {
          fechas: [],
          typeId: h.typeId,
        };
      }
      porHabitacion[h.numeroHabitacion].fechas.push(h.fecha);
    }

    const reservasInfo: Array<{
      numeroHabitacion: number;
      fechaInicio: string;
      fechaFin: string;
      clienteNombre: string;
      clienteApellido: string;
    }> = [];

    for (const [numeroHabitacion, datos] of Object.entries(porHabitacion)) {
      const fechasOrdenadas = datos.fechas.sort();
      const fechaInicio = fechasOrdenadas[0];
      const fechaFin = fechasOrdenadas[fechasOrdenadas.length - 1];

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reservas?numeroHabitacion=${numeroHabitacion}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
        );

        if (res.ok) {
          const array = await res.json();

          if (array.length > 0) {
            const r = array[0];

            reservasInfo.push({
              numeroHabitacion: Number(numeroHabitacion),
              fechaInicio,
              fechaFin,
              clienteNombre: r.cliente?.nombre ?? "",
              clienteApellido: r.cliente?.apellido ?? "",
            });
          }
        }
      } catch (e) {
        console.error("Error consultando reserva:", e);
      }
    }

    setModalReservas(reservasInfo);
  };

  const cerrarModal = () => {
    setModalReservas([]);
  };

  const forzarOcupacion = () => {
    // Cerrar modal y guardar que se debe forzar
    setModalReservas([]);
    sessionStorage.setItem('forzarOcupacion', 'true');
    // Continuar con el flujo normal
    continuarConHuespedes();
  };

  const continuarConHuespedes = () => {
    if (selected.size === 0) {
      setError("⚠ Debes seleccionar al menos una celda.");
      return;
    }

    // Agrupar selecciones por habitación
    const porHabitacion: Record<number, { indices: number[]; tipo: string }> = {};

    for (const k of selected) {
      const [dIndexStr, typeId, habitacionString] = k.split("-");
      const dIndex = Number(dIndexStr);
      const numeroHabitacion = Number(habitacionString);

      if (isNaN(dIndex) || isNaN(numeroHabitacion)) continue;

      if (!porHabitacion[numeroHabitacion]) {
        porHabitacion[numeroHabitacion] = { indices: [], tipo: typeId };
      }
      porHabitacion[numeroHabitacion].indices.push(dIndex);
    }

    // Crear array de habitaciones seleccionadas
    const habitacionesSeleccionadas: HabitacionSeleccionada[] = [];

    for (const [numeroHabitacion, datos] of Object.entries(porHabitacion)) {
      const sortedIndices = datos.indices.sort((a, b) => a - b);
      
      // Agrupar fechas consecutivas
      let inicio = sortedIndices[0];
      let fin = sortedIndices[0];

      for (let i = 1; i < sortedIndices.length; i++) {
        if (sortedIndices[i] === fin + 1) {
          fin = sortedIndices[i];
        } else {
          habitacionesSeleccionadas.push({
            numeroHabitacion: Number(numeroHabitacion),
            tipoHabitacion: datos.tipo,
            fechaInicio: dates[inicio],
            fechaFin: dates[fin],
          });
          inicio = sortedIndices[i];
          fin = sortedIndices[i];
        }
      }

      habitacionesSeleccionadas.push({
        numeroHabitacion: Number(numeroHabitacion),
        tipoHabitacion: datos.tipo,
        fechaInicio: dates[inicio],
        fechaFin: dates[fin],
      });
    }

    // Guardar en sessionStorage y redirigir
    sessionStorage.setItem('habitacionesSeleccionadas', JSON.stringify(habitacionesSeleccionadas));
    router.push('/asignar-huespedes');
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
            onClick={async () => {
              if (selected.size === 0) {
                setError("⚠ Debes seleccionar al menos una celda.");
                return;
              }

              // Validar si hay habitaciones reservadas
              const habitacionesReservadas: Array<{
                numeroHabitacion: number;
                fecha: string;
                typeId: string;
              }> = [];

              for (const k of selected) {
                const [dIndexStr, typeId, habitacionString] = k.split("-");
                const dIndex = Number(dIndexStr);
                const numeroHabitacion = Number(habitacionString);

                if (isNaN(dIndex) || isNaN(numeroHabitacion)) continue;

                const estado = availability[typeId]?.[numeroHabitacion]?.[dIndex];
                if (estado === "RESERVADO") {
                  habitacionesReservadas.push({
                    numeroHabitacion: numeroHabitacion,
                    fecha: dates[dIndex],
                    typeId,
                  });
                }
              }

              // Si hay reservadas, mostrar modal
              if (habitacionesReservadas.length > 0) {
                await mostrarAlertaReservas(habitacionesReservadas);
                return;
              }

              // Si no hay reservadas, continuar directamente
              continuarConHuespedes();
            }}
            className={`px-8 py-3 rounded-2xl text-xl font-bold shadow ${
              selected.size === 0
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-[#a67c52] hover:bg-[#c39a4f] text-white"
            }`}
          >
            Continuar con huéspedes
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

      {/* Modal de alertas para reservas */}
      {modalReservas.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-3xl w-full mx-4">
            <h2 className="text-3xl font-bold text-red-600 mb-4 text-center">
              ⚠️ Habitaciones Reservadas
            </h2>

            <p className="text-gray-700 text-lg mb-6 text-center">
              Algunas habitaciones de la selección se encuentran reservadas:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border-2 border-gray-300">
                <thead>
                  <tr className="bg-[#a67c52] text-white">
                    <th className="border-2 border-gray-300 p-3 text-left">
                      N° Habitación
                    </th>
                    <th className="border-2 border-gray-300 p-3 text-left">
                      Periodo de Reserva
                    </th>
                    <th className="border-2 border-gray-300 p-3 text-left">
                      Titular de la Reserva
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {modalReservas.map((reserva, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="border-2 border-gray-300 p-3 text-center font-semibold text-black">
                        {reserva.numeroHabitacion}
                      </td>
                      <td className="border-2 border-gray-300 p-3 text-black">
                        {reserva.fechaInicio} → {reserva.fechaFin}
                      </td>
                      <td className="border-2 border-gray-300 p-3 text-black">
                        {reserva.clienteNombre} {reserva.clienteApellido}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={cerrarModal}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#6b7280',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
              >
                Cancelar
              </button>
              <button
                onClick={forzarOcupacion}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#ea580c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
              >
                Ocupar de Todas Formas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}