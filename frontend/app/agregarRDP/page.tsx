'use client';

import { useState, useEffect, FormEvent, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './agregarRDP.css';
import BotonCancelar from '../components/BotonCancelar';
import '../styles/estilos.css';

interface Direccion {
  nombreCalle: string;
  numCalle: string;
  piso: string;
  departamento: string;
  localidad: string;
  codPostal: string;
  provincia: string;
  pais: string;
}

interface FormularioRDP {
  cuit: string;
  razonSocial: string;
  direccion: Direccion;
  telefono: string;
  nacionalidad: string;
}

const SPRING_BOOT_API_URL = process.env.NEXT_PUBLIC_API_URL;


const ENDPOINT_CREAR = '/api/responsablespago/crear'; 
const ENDPOINT_CREAR_FORZAR = '/api/responsablespago/crear?forzar=true';



const MENSAJE_ERROR_CUIT =
  'Error: “CUIT no válido.\nPor favor complete el campo correctamente.”';

function normalizarCuit(value: string): string {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
}

function esCuitValido(value: string): boolean {
  return (value ?? '').replace(/\D/g, '').length === 11;
}

function cuitSoloDigitos(value: string): string {
  return (value ?? '').replace(/\D/g, '');
}

export default function AgregarRDP() {
  const router = useRouter();

  const [PopupExitoso, setPopupExitoso] = useState(false);
  const [DuplicadoPopup, setDuplicadoPopup] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [FormularioGlobal, setFormularioGlobal] = useState<FormularioRDP | null>(null);

  const [error, setError] = useState<string | null>(null);
  const cuitRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        if (!SPRING_BOOT_API_URL) {
          router.push('/login');
          return;
        }

        const res = await fetch(`${SPRING_BOOT_API_URL}/revisar-sesion`, {
          credentials: 'include',
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        if (!data.autenticado) {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      }
    };

    verificarSesion();
  }, [router]);

  const renderHeader = () => (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#000',
        borderBottom: '2px solid #b8975a',
      }}
    >
      <h1
        className="font-serif"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '42px',
          fontStyle: 'italic',
          color: '#d8a85b',
        }}
      >
        Dar alta responsable de pago
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="opacity-45" />
      </div>
    </header>
  );

  const [Formulario, setFormulario] = useState({
    cuit: '',
    razonSocial: '',
    calle: '',
    numero: '',
    piso: '',
    departamento: '',
    localidad: '',
    codigoPostal: '',
    provincia: '',
    pais: '',
    codigoPais: '+#',
    telefono: '',
    nacionalidad: '',
  });

  const puedeEnviar = useMemo(() => esCuitValido(Formulario.cuit), [Formulario.cuit]);

  const cambioInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const cambioInputNumero = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valorNumerico = value.replace(/\D/g, '');
    setFormulario((prev) => ({ ...prev, [name]: valorNumerico }));
    setError(null);
  };

  //formato ##-########-# Para el CUIT
  const cambioInputCuit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = normalizarCuit(e.target.value);
    setFormulario((prev) => ({ ...prev, cuit: formatted }));
    setError(null);
  };

  const enviarFormulario = async (forzar: boolean = false) => {
    let datos: FormularioRDP;

    const cuitFormateado = Formulario.cuit;
    const cuitDigits = cuitSoloDigitos(cuitFormateado);

    if (!cuitFormateado || !esCuitValido(cuitFormateado)) {
      setError(MENSAJE_ERROR_CUIT);
      cuitRef.current?.focus();
      return;
    }

    if (forzar && FormularioGlobal) {
      datos = FormularioGlobal;
    } else {
      datos = {
        cuit: cuitDigits,
        razonSocial: Formulario.razonSocial,
        direccion: {
          nombreCalle: Formulario.calle,
          numCalle: Formulario.numero,
          piso: Formulario.piso,
          departamento: Formulario.departamento,
          localidad: Formulario.localidad,
          codPostal: Formulario.codigoPostal,
          provincia: Formulario.provincia,
          pais: Formulario.pais,
        },
        telefono: `${Formulario.codigoPais} ${Formulario.telefono}`,
        nacionalidad: Formulario.nacionalidad,
      };

      setFormularioGlobal(datos);
    }

    try {
      if (!SPRING_BOOT_API_URL) {
        alert('Error de configuración: NEXT_PUBLIC_API_URL no definido.');
        return;
      }

      const url = `${SPRING_BOOT_API_URL}${forzar ? ENDPOINT_CREAR_FORZAR : ENDPOINT_CREAR}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
        credentials: 'include',
      });

      if (response.ok) {
        setPopupExitoso(true);
      } else if (response.status === 409) {
        const mensaje = await response.text();
        setDuplicateMessage(mensaje);
        setDuplicadoPopup(true);
      } else {
        const result = await response.json().catch(() => ({ error: 'Error desconocido' }));
        alert(result.error || result.message || 'Error al crear Responsable de Pago');
      }
    } catch {
      alert('Error de conexión con el servidor');
    }
  };

  const subirFormulario = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await enviarFormulario(false);
  };

  const resetForm = () => {
    setFormulario({
      cuit: '',
      razonSocial: '',
      calle: '',
      numero: '',
      piso: '',
      departamento: '',
      localidad: '',
      codigoPostal: '',
      provincia: '',
      pais: '',
      codigoPais: '+#',
      telefono: '',
      nacionalidad: '',
    });
    setError(null);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {renderHeader()}

      <main className="agregarrdp-bg">
        <form id="formularioRDP" className="formularioRDP" onSubmit={subirFormulario}>
          <div className="form-row">
            <div className="form-group solo-numeros">
              <label htmlFor="cuit">CUIT</label>
              <input
                ref={cuitRef}
                type="text"
                id="cuit"
                name="cuit"
                placeholder="##-########-#"
                value={Formulario.cuit}
                onChange={cambioInputCuit}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="razonSocial">Razón Social</label>
              <input
                type="text"
                id="razonSocial"
                name="razonSocial"
                value={Formulario.razonSocial}
                onChange={cambioInput}
                required
              />
            </div>
          </div>

          {error && (
            <p
              style={{
                color: 'red',
                textAlign: 'center',
                marginTop: '20px',
                whiteSpace: 'pre-line',
              }}
            >
              {error}
            </p>
          )}

          <div className="form-row four-col">
            <div className="form-group">
              <label htmlFor="calle">Calle</label>
              <input type="text" id="calle" name="calle" value={Formulario.calle} onChange={cambioInput} required />
            </div>

            <div className="form-group">
              <label htmlFor="numero">Núm</label>
              <input
                type="text"
                className="solo-numeros"
                id="numero"
                name="numero"
                value={Formulario.numero}
                onChange={cambioInputNumero}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="piso">Piso</label>
              <input type="text" id="piso" name="piso" value={Formulario.piso} onChange={cambioInput} />
            </div>

            <div className="form-group">
              <label htmlFor="departamento">Dept</label>
              <input type="text" id="departamento" name="departamento" value={Formulario.departamento} onChange={cambioInput} />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label htmlFor="localidad">Localidad</label>
              <input type="text" id="localidad" name="localidad" value={Formulario.localidad} onChange={cambioInput} required />
            </div>

            <div className="form-group">
              <label htmlFor="codigoPostal">Cod. Postal</label>
              <input type="text" id="codigoPostal" name="codigoPostal" value={Formulario.codigoPostal} onChange={cambioInput} required />
            </div>

            <div className="form-group">
              <label htmlFor="provincia">Provincia</label>
              <input type="text" id="provincia" name="provincia" value={Formulario.provincia} onChange={cambioInput} required />
            </div>
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label htmlFor="pais">País</label>
              <input type="text" id="pais" name="pais" value={Formulario.pais} onChange={cambioInput} required />
            </div>

            <div className="form-group">
              <label htmlFor="nacionalidad">Nacionalidad</label>
              <input type="text" id="nacionalidad" name="nacionalidad" value={Formulario.nacionalidad} onChange={cambioInput} required />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Num. de Teléfono</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  id="codigoPais"
                  name="codigoPais"
                  style={{ maxWidth: '100px' }}
                  value={Formulario.codigoPais}
                  onChange={cambioInput}
                  required
                >
                  <option value="+#">+#</option>
                  <option value="+54">+54 (Argentina)</option>
                  <option value="+598">+598 (Uruguay)</option>
                  <option value="+51">+51 (Peru)</option>
                  <option value="+55">+55 (Brasil)</option>
                </select>

                <input
                  type="tel"
                  id="telefono"
                  className="solo-numeros"
                  name="telefono"
                  style={{ flex: 1 }}
                  value={Formulario.telefono}
                  onChange={cambioInputNumero}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn" disabled={!puedeEnviar}>
              Siguiente
            </button>

            <div className="mt-6 w-full flex justify-end">
              <BotonCancelar />
            </div>
          </div>
        </form>
      </main>

      {/* POPUP ÉXITO */}
      {PopupExitoso && (
        <div className="popup">
          <div className="popup-contenido">
            <div className="popup-encabezado">
              <Image className="popup-icono" src="img/iconoExito.svg" alt="icono" width={100} height={30} />
              <div className="popup-descripcion">
                <h2>Responsable de Pago cargado exitosamente</h2>
                <p>¿Desea cargar otro Responsable de Pago?</p>
              </div>
            </div>

            <div className="popup-botonera">
              <button
                className="popup-boton"
                onClick={() => {
                  setPopupExitoso(false);
                  resetForm();
                }}
              >
                Sí
              </button>
              <button className="popup-boton" onClick={() => router.push('/menu')}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DUPLICADO */}
      {DuplicadoPopup && (
        <div className="popup" style={{ display: 'flex' }}>
          <div className="popup-contenido">
            <div className="popup-encabezado">
              <div className="popup-icono">
                <Image src="img/iconoAdvertencia.svg" alt="icono" width={100} height={30} />
              </div>
              <div className="popup-descripcion">
                <h2>Responsable de Pago ya registrado</h2>
                <p>{duplicateMessage}</p>
              </div>
            </div>

            <div className="popup-botonera">
              <button
                className="popup-boton"
                onClick={async () => {
                  setDuplicadoPopup(false);
                  await enviarFormulario(true);
                }}
              >
                Aceptar Igualmente
              </button>
              <button
                className="popup-boton"
                onClick={() => {
                  setDuplicadoPopup(false);
                  document.getElementById('cuit')?.focus();
                }}
              >
                Corregir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
