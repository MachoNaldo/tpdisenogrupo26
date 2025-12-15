"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ReservarHabitacion() {
  const router = useRouter();

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [error, setError] = useState<string | null>(null);

  const continuar = () => {
    if (!desde || !hasta) {
      setError("Debes seleccionar ambas fechas.");
      return;
    }

    if (new Date(desde) > new Date(hasta)) {
      setError("La fecha 'Desde' no puede ser mayor que 'Hasta'.");
      return;
    }

    router.push(`/reservar?desde=${desde}&hasta=${hasta}`);
  };

  const cancelar = () => {
    router.push("/menu");
  };

  return (
    <main className="ui-hero">
      <div className="ui-hero-bg" />
      <div className="ui-hero-overlay-65" />

      <div className="ui-hero-card">
        <h1 className="ui-hero-title">Buscar habitación</h1>

        <p className="ui-hero-subtitle">
          Ingresa una fecha de inicio y fin para revisar la
          <br />
          disponibilidad de las habitaciones.
        </p>

        {error && (
          <div className="error-box">
            <div className="error-icon">
              <Image src="img/iconoError.svg" alt="icono" width={40} height={40} />
            </div>
            <p className="error-text">{error}</p>
          </div>
        )}

        <div className="ui-date-row">
          <div className="ui-field-col">
            <label className="ui-label-gold">Desde Fecha</label>
            <input
              type="date"
              className="ui-input-date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </div>

          <div className="ui-field-col">
            <label className="ui-label-gold">Hasta Fecha</label>
            <input
              type="date"
              className="ui-input-date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </div>
        </div>

        <div className="ui-actions-center">
          <button className="btn" onClick={continuar}>
            Buscar
          </button>

          <button className="btn" onClick={cancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </main>
  );
}
