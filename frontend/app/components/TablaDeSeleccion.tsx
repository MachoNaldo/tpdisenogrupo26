"use client";

import { useMemo, useState } from "react";

// Estados posibles de una habitación
type Estados = "Libre" | "Reservada" | "Ocupada" | "Fuera de Servicio";

// Tipo de habitación
type tipoHabitacion = {
  id: string;
  nombre: string;
  numeros: number[];
};

// Datos del cliente
type DatosCliente = {
  nombre: string;
  apellido: string;
  telefono: string;
};

// Reserva agrupada por habitación
type ReservaAgrupada = {
  tipoHabitacionNombre: string;
  numeroHabitacion: number;
  fechaInicio: string;
  fechaFin: string;
};

// Fechas
const dates = [
  "23/04/2025",
  "24/04/2025",
  "25/04/2025",
  "26/04/2025",
  "27/04/2025",
  "28/04/2025",
  "29/04/2025",
];

// Listas de cada tipo de habitaciones
const roomTypes: tipoHabitacion[] = [
  { id: "ind", nombre: "Individual Estándar", numeros: [101, 102, 103] },
  { id: "dblStd", nombre: "Doble Estándar", numeros: [201, 202] },
  { id: "dblSup", nombre: "Doble Superior", numeros: [301, 302, 303] },
  { id: "fam", nombre: "Sup. Family Plan", numeros: [401] },
  { id: "suite", nombre: "Suite Doble", numeros: [501, 502] },
];

// Estados iniciales para probar
const estadosIniciales: Record<string, Record<number, Estados[]>> = {
  ind: {
    101: ["Libre", "Reservada", "Libre", "Libre", "Libre", "Libre", "Libre"],
    102: ["Libre", "Libre", "Libre", "Ocupada", "Reservada", "Libre", "Libre"],
    103: ["Libre", "Libre", "Libre", "Libre", "Libre", "Libre", "Libre"],
  },
  dblStd: {
    201: ["Libre", "Libre", "Libre", "Libre", "Libre", "Libre", "Libre"],
    202: ["Reservada", "Ocupada", "Libre", "Libre", "Libre", "Libre", "Libre"],
  },
  dblSup: {
    301: ["Fuera de Servicio", "Fuera de Servicio", "Fuera de Servicio", "Fuera de Servicio", "Fuera de Servicio", "Fuera de Servicio", "Fuera de Servicio"],
    302: ["Libre", "Libre", "Libre", "Ocupada", "Libre", "Libre", "Libre"],
    303: ["Libre", "Libre", "Libre", "Libre", "Libre", "Libre", "Libre"],
  },
  fam: {
    401: ["Libre", "Libre", "Libre", "Libre", "Libre", "Libre", "Libre"],
  },
  suite: {
    501: ["Reservada", "Reservada", "Ocupada", "Libre", "Libre", "Libre", "Libre"],
    502: ["Libre", "Libre", "Libre", "Libre", "Libre", "Libre", "Libre"],
  },
};

// Componente de celda de la tabla
function EstructuraDeTabla({
  value,
  isSelected,
  onClick
}: {
  value: Estados;
  isSelected: boolean;
  onClick: () => void;
}) {
  const bgColor = isSelected
    ? "bg-blue-400"
    : value === "Libre"
      ? "bg-green-200"
      : value === "Reservada"
        ? "bg-yellow-200"
        : value === "Ocupada"
          ? "bg-red-200"
          : "bg-gray-400";

  return (
    <td
      className={`border border-gray-700 p-3 text-center cursor-pointer ${bgColor} 
                  hover:opacity-80 transition-opacity`}
      onClick={onClick}
    >
      {value}
    </td>
  );
}

export default function TablaDeInteraccion() {
  const [availability, setAvailability] =
    useState<Record<string, Record<number, Estados[]>>>(estadosIniciales);

  // Guarda las habitaciones seleccionadas en el select de cada columna
  const [selectedRoomByType, setSelectedRoomByType] = useState<Record<string, number>>(
    () =>
      roomTypes.reduce((acc, t) => {
        acc[t.id] = t.numeros[0];
        return acc;
      }, {} as Record<string, number>)
  );

  // Para las celdas pintadas de azul
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Estados para el formulario
  const [showFormulario, setShowFormulario] = useState(false);
  const [datosReservaTemp, setDatosReservaTemp] = useState<ReservaAgrupada[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Datos del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");

  const keyOf = (dateIndex: number, typeId: string, roomNumber: number) =>
    `${dateIndex}-${typeId}-${roomNumber}`;

  // Seleccionar celda
  const seleccionDeCelda = (dateIndex: number, typeId: string, roomNumber: number) => {
    setError(null);
    const k = keyOf(dateIndex, typeId, roomNumber);

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  // Cambiar el select de una columna
  const changeRoom = (typeId: string, roomNumber: number) => {
    setSelectedRoomByType((prev) => ({ ...prev, [typeId]: roomNumber }));
    setError(null);
  };

  // Agrupar selecciones por habitación con fecha inicio y fin
  const agruparPorHabitacion = (selectedSet: Set<string>): ReservaAgrupada[] => {
    const grupos: Record<string, number[]> = {};

    // Se agrupan los índices de fechas por tipo y número de habitación
    for (const k of selectedSet) {
      const [dStr, typeId, numStr] = k.split("-");
      const dateIndex = Number(dStr);
      const roomNumber = Number(numStr);
      const key = `${typeId}-${roomNumber}`;

      if (!grupos[key]) {
        grupos[key] = [];
      }
      grupos[key].push(dateIndex);
    }

    // Preparamos las reservas agrupadas
    const reservas: ReservaAgrupada[] = [];

    for (const [key, indices] of Object.entries(grupos)) {
      const [typeId, numStr] = key.split("-");
      const roomNumber = Number(numStr);
      const roomType = roomTypes.find((t) => t.id === typeId);

      // Ordenamos los indices de las fechas seleccionadas
      indices.sort((a, b) => a - b);

      // Valida que sean consecutivas las fechas que se eligieron
      for (let i = 0; i < indices.length - 1; i++) {
        if (indices[i + 1] - indices[i] !== 1) {
          throw new Error(
            `Las fechas seleccionadas para la habitación ${roomNumber} deben ser consecutivas`
          );
        }
      }

      const fechaInicio = dates[indices[0]];
      const fechaFin = dates[indices[indices.length - 1]];
      //Guardamos la reserva
      reservas.push({
        tipoHabitacionNombre: roomType?.nombre || typeId,
        numeroHabitacion: roomNumber,
        fechaInicio,
        fechaFin,
      });
    }

    return reservas;
  };

  // Botón reservar 
  const reservar = () => {
    if (selected.size === 0) {
      setError("⚠️ Seleccioná al menos una habitación para reservar.");
      return;
    }

    const invalidStates: Estados[] = ["Reservada", "Ocupada", "Fuera de Servicio"];

    // Validar que todas las seleccionadas estén "Libre"
    for (const k of selected) {
      const [dStr, typeId, numStr] = k.split("-");
      const d = Number(dStr);
      const roomNumber = Number(numStr);

      const state = availability[typeId][roomNumber][d];
      if (invalidStates.includes(state)) {
        setError("⚠️ No es posible reservar. Alguna habitación seleccionada no está disponible.");
        return;
      }
    }

    // Agrupamos por habitación y validamos la consecutividad
    try {
      const reservasAgrupadas = agruparPorHabitacion(selected);
      setDatosReservaTemp(reservasAgrupadas);
      setShowFormulario(true);
      setError(null);
    } catch (err: any) {
      setError(`⚠️ ${err.message}`);
    }
  };

  // Confirmar reserva con datos del que realizara la reserva 
  const confirmarReservaConDatos = async () => {
    // Valida formulario
    if (!nombre.trim() || !apellido.trim() || !telefono.trim()) {
      setError("⚠️ Por favor completá todos los campos del formulario.");
      return;
    }

    if (!datosReservaTemp) {
      setError("⚠️ No hay datos de reserva.");
      return;
    }

    const payload = {
      cliente: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
      },
      reservas: datosReservaTemp,
    };

    setIsLoading(true);
    setError(null);

    try {
      // POST que va al backend
      const response = await fetch("http://localhost:8080/api/reservas/reservar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al realizar la reserva");
      }

      // Si el backend responde OK, actualizamos el estado local
      setAvailability((prev) => {
        const copy = structuredClone(prev);

        for (const k of selected) {
          const [dStr, typeId, numStr] = k.split("-");
          const d = Number(dStr);
          const roomNumber = Number(numStr);

          if (copy[typeId][roomNumber][d] === "Libre") {
            copy[typeId][roomNumber][d] = "Reservada";
          }
        }
        return copy;
      });

      // Limpiar todo
      setSelected(new Set());
      setShowFormulario(false);
      setDatosReservaTemp(null);
      setNombre("");
      setApellido("");
      setTelefono("");
      setError(null);

      alert("✅ Reserva confirmada exitosamente!");
    } catch (err: any) {
      setError(`⚠️ Error al confirmar la reserva: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar formulario
  const cancelarFormulario = () => {
    setShowFormulario(false);
    setDatosReservaTemp(null);
    setNombre("");
    setApellido("");
    setTelefono("");
    setError(null);
  };

  const selectedKeys = useMemo(() => selected, [selected]);

  return (
    <div className="w-full mt-1 flex flex-col items-center p-4">
      {error && (
        <div className="text-sm text-red-700 bg-red-100 border border-red-300 
                        px-3 py-2 rounded mb-4 flex items-center gap-2 max-w-2xl">
          <span>⚠️</span> {error}
        </div>
      )}

      <table className="w-full border-collapse text-sm shadow-md">
        <thead className="text-black font-bold">
          {/* Fila 1 */}
          <tr className="bg-[#f5f5f5]">
            <th className="bg-[#b18b45] border border-gray-700 p-2">Periodo/Tipo</th>
            {roomTypes.map((t) => (
              <th key={t.id} className="border border-gray-700 p-2 text-center">
                {t.nombre}
              </th>
            ))}
          </tr>

          {/* Fila 2 */}
          <tr className="bg-[#848282]">
            <th className="border border-gray-700 p-2 text-center">
              N° de habitación
            </th>

            {roomTypes.map((t) => (
              <th key={t.id} className="border p-2">
                <select
                  className="w-1/2 bg-[#f5f5f5] border rounded px-2 py-1 text-center"
                  value={selectedRoomByType[t.id]}
                  onChange={(e) => changeRoom(t.id, Number(e.target.value))}
                >
                  {t.numeros.map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {dates.map((date, dIndex) => (
            <tr key={date}>
              {/* Columna de fechas */}
              <td className="border border-gray-700 bg-gray-200 text-center py-2 font-semibold">
                {date}
              </td>

              {/* Columnas por tipo y N° de habitación */}
              {roomTypes.map((t) => {
                const roomNumber = selectedRoomByType[t.id];
                const state = availability[t.id][roomNumber][dIndex];

                return (
                  <EstructuraDeTabla
                    key={t.id}
                    value={state}
                    isSelected={selectedKeys.has(keyOf(dIndex, t.id, roomNumber))}
                    onClick={() => seleccionDeCelda(dIndex, t.id, roomNumber)}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón reservar */}
      {!showFormulario && (
        <button
          className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl shadow 
                     hover:bg-blue-700 transition font-semibold"
          onClick={reservar}
        >
          Reservar
        </button>
      )}

      {/* Formulario de datos del cliente */}
      {showFormulario && datosReservaTemp && (
        <div className="mt-6 bg-black border-2 border-[#b18b45] rounded-lg p-6 w-full max-w-2xl shadow-lg text-white">
          <h2 className="text-xl font-bold mb-4 text-[#b18b45]">

            Completá tus datos para la reserva
          </h2>

          {/* Resumen de reservas */}
          <div className="mb-6 bg-[#1a1a1a] p-4 rounded border border-[#b18b45]">
            <h3 className="font-semibold mb-2 text-[#b18b45]">Resumen de tu reserva:</h3>

            {datosReservaTemp.map((reserva, idx) => (
              <div key={idx} className="text-sm text-gray-600 mb-1">
                • Habitación {reserva.numeroHabitacion} ({reserva.tipoHabitacionNombre})
                <br />
                &nbsp;&nbsp;Del {reserva.fechaInicio} al {reserva.fechaFin}
              </div>
            ))}
          </div>

          {/* Campos del formulario */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#b18b45] mb-1">

                Nombre *
              </label>
              <input
                type="text"
                className="w-full border border-[#b18b45] bg-black text-white rounded px-3 py-2 
focus:outline-none focus:ring-2 focus:ring-[#b18b45]"

                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#b18b45] mb-1">

                Apellido *
              </label>
              <input
                type="text"
                className="w-full border border-[#b18b45] bg-black text-white rounded px-3 py-2 
focus:outline-none focus:ring-2 focus:ring-[#b18b45]"

                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Tu apellido"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#b18b45] mb-1">

                Teléfono *
              </label>
              <input
                type="tel"
                className="w-full border border-[#b18b45] bg-black text-white rounded px-3 py-2 
focus:outline-none focus:ring-2 focus:ring-[#b18b45]"

                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+54 9 11 1234-5678"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-6">
            <button
              className="flex-1 bg-[#b18b45] text-black px-6 py-3 rounded-xl shadow 
hover:bg-[#d4a85a] transition font-semibold disabled:bg-gray-600 
disabled:cursor-not-allowed"

              onClick={confirmarReservaConDatos}
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Confirmar Reserva"}
            </button>

            <button
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-xl shadow 
                         hover:bg-gray-600 transition font-semibold"
              onClick={cancelarFormulario}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}