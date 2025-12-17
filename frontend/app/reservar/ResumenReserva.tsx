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
    <div className="mt-8 w-full max-w-3xl mx-auto bg-[#282828] border-4 border-[#a67c52] rounded-xl p-6 shadow-xl">
      <h3 className="text-3xl font-bold text-[#a67c52] text-center mb-6">
        Confirmación de Reserva
      </h3>

      <div className=" text-[#a67c52]  mb-6 bg-black border border-white p-4 rounded-xl">
        <h4 className="text-xl font-semibold mb-3 text-center">Datos del cliente</h4>
        <p><strong>Nombre:</strong> <span style={{ color: "#E9B525" }}>{cliente.nombre}</span></p>
        <p><strong>Apellido:</strong> <span style={{ color: "#E9B525" }}>{cliente.apellido}</span></p>
        <p><strong>Teléfono:</strong> <span style={{ color: "#E9B525" }}>{cliente.telefono}</span></p>
      </div>

      <div className="space-y-6">
        {reservas.map((r, i) => (
          <div key={i} className="text-[#a67c52] p-4 bg-black border border-white rounded-xl shadow ">
            <p className=" text-xl font-bold mb-2 text-center">
              Detalles de la habitación 
            </p>

            <p>
              <strong>Número:</strong> <span style={{ color: "#E9B525" }}>{r.numeroHabitacion}</span>
            </p>
            <p>
              <strong>Tipo:</strong> <span style={{ color: "#E9B525" }}>{r.tipoHabitacion}</span>
            </p>

            <p>
              <strong>Ingreso:</strong> <span style={{ color: "#E9B525" }}>{formatFecha(r.fechaInicio)}</span>
            </p>

            <p>
              <strong>Egreso:</strong> <span style={{ color: "#E9B525" }}>{formatFecha(r.fechaFin)}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onRechazar}
          className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow">
          RECHAZAR
        </button>

        <button
          onClick={onAceptar}
          className="px-8 py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow">
          ACEPTAR
        </button>
      </div>
    </div>
  );
}
