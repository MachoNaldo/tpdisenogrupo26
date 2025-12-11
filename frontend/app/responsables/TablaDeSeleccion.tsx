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
... (Quedan 165 líneas)