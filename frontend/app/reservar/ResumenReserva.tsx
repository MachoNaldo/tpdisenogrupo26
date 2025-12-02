'use client';

interface ReservaRango {
  numeroHabitacion: number;
  fechaInicio: string;
  fechaFin: string;
  tipoHabitacion: string;
}

interface Props {
  reservas: ReservaRango[];
  cliente: {
    nombre: string;
    apellido: string;
    telefono: string;
  };
  onAceptar: () => void;
  onRechazar: () => void;
}

export default function ResumenReserva({ reservas, cliente, onAceptar, onRechazar }: Props) {
  const formatFecha = (f: string) => {
    const date = new Date(f);
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return date.toLocaleDateString("es-AR", opciones);
  };

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto bg-white border-4 border-[#a67c52] rounded-xl p-6 shadow-xl">
      <h3 className="text-3xl font-bold text-[#a67c52] text-center mb-6">
        Confirmación de Reserva
      </h3>

      <div className="mb-6 bg-gray-100 p-4 rounded-xl">
        <h4 className="text-xl font-semibold mb-3">Datos del Cliente</h4>
        <p><strong>Nombre:</strong> {cliente.nombre}</p>
        <p><strong>Apellido:</strong> {cliente.apellido}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
      </div>

      <div className="space-y-6">
        {reservas.map((r, i) => (
          <div key={i} className="p-4 bg-gray-100 border rounded-xl shadow">
            <p className="text-xl font-bold text-[#a67c52] mb-2">
              {r.tipoHabitacion} — Habitación {r.numeroHabitacion}
            </p>

            <p>
              <strong>Ingreso:</strong> {formatFecha(r.fechaInicio)}, 12:00hs
            </p>

            <p>
              <strong>Egreso:</strong> {formatFecha(r.fechaFin)}, 10:00hs
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onRechazar}
          className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow"
        >
          RECHAZAR
        </button>

        <button
          onClick={onAceptar}
          className="px-8 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow"
        >
          ACEPTAR
        </button>
      </div>
    </div>
  );
}
