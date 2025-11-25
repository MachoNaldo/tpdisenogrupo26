"use client";

import { useMemo, useState } from "react";
import EstructuraDeTabla, { Estados } from "./EstructuraDeTabla";

//ESTO ES POR AHORA PARA PROBAR LA TABLA


//Tipo de habitacion
type tipoHabitacion = {
  id: string;
  nombre: string;
  numeros: number[];
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



//Listas de cada tipo de habitaciones
const roomTypes: tipoHabitacion[] = [
  { id: "ind", nombre: "Individual Estándar", numeros: [101, 102, 103] },
  { id: "dblStd", nombre: "Doble Estándar", numeros: [201, 202] },
  { id: "dblSup", nombre: "Doble Superior", numeros: [301, 302, 303] },
  { id: "fam", nombre: "Sup. Family Plan", numeros: [401] },
  { id: "suite", nombre: "Suite Doble", numeros: [501, 502] },
];

//Estados para probar
const estadosIniciales: Record<string, Record<number, Estados[]>> = {
  ind: {
    101: ["Libre","Reservada","Libre","Libre","Libre","Libre","Libre"],
    102: ["Libre","Libre","Libre","Ocupada","Reservada","Libre","Libre"],
    103: ["Libre","Libre","Libre","Libre","Libre","Libre","Libre"],
  },
  dblStd: {
    201: ["Libre","Libre","Libre","Libre","Libre","Libre","Libre"],
    202: ["Reservada","Ocupada","Libre","Libre","Libre","Libre","Libre"],
  },
  dblSup: {
    301: ["Fuera de Servicio","Fuera de Servicio","Fuera de Servicio","Fuera de Servicio","Fuera de Servicio","Fuera de Servicio","Fuera de Servicio"],
    302: ["Libre","Libre","Libre","Ocupada","Libre","Libre","Libre"],
    303: ["Libre","Libre","Libre","Libre","Libre","Libre","Libre"],
  },
  fam: {
    401: ["Libre","Libre","Libre","Libre","Libre","Libre","Libre"],
  },
  suite: {
    501: ["Reservada","Reservada","Ocupada","Libre","Libre","Libre","Libre"],
    502: ["Libre","Libre","Libre","Libre","Libre","Libre","Libre"],
  },
};

export default function TablaDeInteraccion() {
  const [availability, setAvailability] =
    useState<Record<string, Record<number, Estados[]>>>(estadosIniciales);

  //Seleccion de habitacion
  const [selectedRoomByType, setSelectedRoomByType] = useState<Record<string, number>>(
    () =>
      roomTypes.reduce((acc, t) => {
        acc[t.id] = t.numeros[0];
        return acc;
      }, {} as Record<string, number>)
  );

 
  
  //Para las celdas pintadas dde azul
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const keyOf = (dateIndex: number, typeId: string, roomNumber: number) =>
    `${dateIndex}-${typeId}-${roomNumber}`;




  // Seleccionar
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



  /// Cambiar el select de una columna 
  const changeRoom = (typeId: string, roomNumber: number) => {
    setSelectedRoomByType((prev) => ({ ...prev, [typeId]: roomNumber }));
    setError(null);
  };









  //Boton reservar
  const reservar = () => {
    if (selected.size === 0) {
      setError("⚠️ Seleccioná al menos una habitación para reservar.");
      return;
    }

    const invalidStates: Estados[] = ["Reservada", "Ocupada", "Fuera de Servicio"];








    // Aca se valida si alguna seleccionada no esta "Libre"
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










    // Aca se controla que solo las seleccionadas que estam "libres" pasan a Reservada
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

    setSelected(new Set());
    setError(null);
  };

  const selectedKeys = useMemo(() => selected, [selected]);

  return (
    <div className="w-full mt-1 flex flex-col items-center">

      {error && (
        <div className="text-sm text-white border border-gray-100 
                        px-3 py-2 rounded mb-4 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <table className="w-full border-collapse text-sm shadow-md">
        <thead className="text-black font-bold">


          {/*Fila 1*/}

          <tr className="bg-[#f5f5f5]">
            <th className="bg-[#b18b45] border border-gray-700 p-2">Periodo/Tipo</th>
            {roomTypes.map((t) => (
              <th key={t.id} className="border border-gray-700 p-2 text-center">
                {t.nombre}
              </th>
            ))}
          </tr>

          {/*Fila 2*/}
          <tr className="bg-[#848282]">
            <th className="border border-gray-700 p-2 text-center">
              N° de habitación
            </th>

            {roomTypes.map((t) => (
              <th key={t.id} className="border p-2">
                <select className="w-1/2 bg-[#f5f5f5] border rounded px-2 py-1 text-center"value={selectedRoomByType[t.id]}onChange={(e) => changeRoom(t.id, Number(e.target.value))}>
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
              {/* Columna dde fechas */}
              <td className="border border-gray-700 bg-gray-200 text-center py-2 font-semibold">
                {date}
              </td>

              {/* Columnas por tipo y N° de habitacion*/}
              {roomTypes.map((t) => {
                const roomNumber = selectedRoomByType[t.id];
                const state = availability[t.id][roomNumber][dIndex];

                return (
                  <EstructuraDeTabla key={t.id} value={state} isSelected={selectedKeys.has(keyOf(dIndex, t.id, roomNumber))} onClick={() => seleccionDeCelda(dIndex, t.id, roomNumber)}/>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón reservar */}
      <button
        className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl shadow 
                   hover:bg-blue-700 transition font-semibold"
        onClick={reservar}
      >
        Reservar
      </button>
    </div>
  );
}
