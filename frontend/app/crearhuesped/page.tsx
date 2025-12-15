'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import "./crearhuesped.css";
import BotonCancelar from "../components/BotonCancelar";
import "../styles/estilos.css";

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

interface Formulario {
  apellido: string;
  nombres: string;
  tipoDocumento: string;
  documentacion: string;
  sexo: string;
  fechaNacimiento: string;
  consumidorFinal: string;
  email: string;
  cuit: string;
  direccion: Direccion;
  telefono: string;
  nacionalidad: string;
  ocupacion: string;
}

function normalizarCuit(value: string): string {
  const digits = (value ?? '').replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 10) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10, 11)}`;
}

function cuitSoloDigitos(value: string): string {
  return (value ?? '').replace(/\D/g, '');
}

export default function CrearHuesped() {
  const router = useRouter();
  const [PopupExitoso, setPopupExitoso] = useState(false);
  const [DuplicadoPopup, setDuplicadoPopup] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [FormularioGlobal, setFormularioGlobal] = useState<Formulario | null>(null);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/revisar-sesion`, {
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        if (!data.autenticado) {
          router.push("/login");
        }

      } catch (err) {
        router.push("/login");
      }
    };

    verificarSesion();
  }, []);

  const renderHeader = () => (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#000', borderBottom: '2px solid #b8975a' }}>
      <h1 className="font-serif" style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontStyle: 'italic', color: '#d8a85b' }}>
        Dar alta de huésped
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="opacity-45" />
      </div>
    </header>
  );

  const [Formulario, setFormulario] = useState({
    apellido: '',
    nombres: '',
    tipoDocumento: '',
    documento: '',
    dia: '',
    mes: '',
    anio: '',
    sexo: '',
    consumidorFinal: '',
    email: '',
    cuit: '',
    calle: '',
    numero: '',
    piso: '',
    departamento: '',
    localidad: '',
    codigoPostal: '',
    codigoPais: '+#',
    telefono: '',
    provincia: '',
    pais: '',
    nacionalidad: '',
    ocupacion: ''
  });

  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = new Date().getFullYear();
  const anios = Array.from({ length: 101 }, (_, i) => currentYear - i);

  const cambioInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const cambioInputNumero = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valorNumerico = value.replace(/\D/g, '');
    setFormulario(prev => ({ ...prev, [name]: valorNumerico }));
  };

  const cambioCuitFormateado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormulario(prev => ({ ...prev, cuit: normalizarCuit(value) }));
  };

  const enviarFormulario = async (forzar: boolean = false) => {
    let datos: Formulario;

    if (forzar && FormularioGlobal) {
      datos = FormularioGlobal;
    } else {
      const dia = Formulario.dia.padStart(2, '0');
      const mes = Formulario.mes.padStart(2, '0');
      const anio = Formulario.anio;

     
      const cuitSinGuiones = cuitSoloDigitos(Formulario.cuit);

      datos = {
        apellido: Formulario.apellido,
        nombres: Formulario.nombres,
        tipoDocumento: Formulario.tipoDocumento,
        documentacion: Formulario.documento,
        sexo: Formulario.sexo,
        fechaNacimiento: `${anio}-${mes}-${dia}`,
        consumidorFinal: Formulario.consumidorFinal,
        email: Formulario.email,
        cuit: cuitSinGuiones,
        direccion: {
          nombreCalle: Formulario.calle,
          numCalle: Formulario.numero,
          piso: Formulario.piso,
          departamento: Formulario.departamento,
          localidad: Formulario.localidad,
          codPostal: Formulario.codigoPostal,
          provincia: Formulario.provincia,
          pais: Formulario.pais
        },
        telefono: `${Formulario.codigoPais} ${Formulario.telefono}`,
        nacionalidad: Formulario.nacionalidad,
        ocupacion: Formulario.ocupacion
      };

      setFormularioGlobal(datos);
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = forzar ? '/crearhuesped?forzar=true' : '/crearhuesped';
      const fullUrl = `${baseUrl}/api/huespedes${endpoint}`;

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        alert(result.error || result.message || 'Error al crear huésped');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  const subirFormulario = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await enviarFormulario(false);
  };

  const resetForm = () => {
    setFormulario({
      apellido: '',
      nombres: '',
      tipoDocumento: '',
      documento: '',
      dia: '',
      mes: '',
      anio: '',
      sexo: '',
      consumidorFinal: '',
      email: '',
      cuit: '',
      calle: '',
      numero: '',
      piso: '',
      departamento: '',
      localidad: '',
      codigoPostal: '',
      codigoPais: '+#',
      telefono: '',
      provincia: '',
      pais: '',
      nacionalidad: '',
      ocupacion: ''
    });
    window.scrollTo(0, 0);
  };

  return (
    <>
      {renderHeader()}
      <main className="crearhuesped-bg">

        <form id="formularioHuesped" className="formularioHuesped" onSubmit={subirFormulario}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={Formulario.apellido}
                onChange={cambioInput}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nombres">Nombres</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={Formulario.nombres}
                onChange={cambioInput}
                required
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label htmlFor="tipoDocumento">Tipo de documento</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={Formulario.tipoDocumento}
                onChange={cambioInput}
                required
              >
                <option value="">---</option>
                <option value="DNI">DNI</option>
                <option value="LE">LE</option>
                <option value="LC">LC</option>
                <option value="PASAPORTE">PASAPORTE</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="form-group solo-numeros">
              <label htmlFor="documento">Documento</label>
              <input
                type="text"
                id="documento"
                name="documento"
                value={Formulario.documento}
                onChange={cambioInputNumero}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha de nacimiento</label>
              <div className="date-group">
                <select
                  id="dia"
                  name="dia"
                  value={Formulario.dia}
                  onChange={cambioInput}
                  required
                >
                  <option value="">Día</option>
                  {dias.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  id="mes"
                  name="mes"
                  value={Formulario.mes}
                  onChange={cambioInput}
                  required
                >
                  <option value="">Mes</option>
                  {meses.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
                <select
                  id="anio" name="anio" value={Formulario.anio} onChange={cambioInput} required>
                  <option value="">Año</option>
                  {anios.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="sexo">Sexo</label>
              <select
                id="sexo"
                name="sexo"
                value={Formulario.sexo}
                onChange={cambioInput}
                required
              >
                <option value="">---</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="consumidorFinal">Consumidor final</label>
              <select
                id="consumidorFinal"
                name="consumidorFinal"
                value={Formulario.consumidorFinal}
                onChange={cambioInput}
                required
              >
                <option value="">---</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email (opcional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={Formulario.email}
                onChange={cambioInput}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cuit">CUIT (opcional)</label>
              <input
                type="text"
                id="cuit"
                name="cuit"
                placeholder="##-########-#"
                value={Formulario.cuit}
                onChange={cambioCuitFormateado} 
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="form-row four-col">
            <div className="form-group">
              <label htmlFor="calle">Calle</label>
              <input
                type="text"
                id="calle"
                name="calle"
                value={Formulario.calle}
                onChange={cambioInput}
                required
              />
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
              <input
                type="text"
                id="piso"
                name="piso"
                value={Formulario.piso}
                onChange={cambioInput}
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label htmlFor="departamento">Dept</label>
              <input
                type="text"
                id="departamento"
                name="departamento"
                value={Formulario.departamento}
                onChange={cambioInput}
              />
            </div>
            <div className="form-group">
              <label htmlFor="localidad">Localidad</label>
              <input
                type="text"
                id="localidad"
                name="localidad"
                value={Formulario.localidad}
                onChange={cambioInput}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="codigoPostal">Cod. Postal</label>
              <input
                type="text"
                id="codigoPostal"
                name="codigoPostal"
                value={Formulario.codigoPostal}
                onChange={cambioInput}
                required
              />
            </div>
          </div>

          <div className="form-row">
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

          <div className="form-row three-col">
            <div className="form-group">
              <label htmlFor="provincia">Provincia</label>
              <input
                type="text"
                id="provincia"
                name="provincia"
                value={Formulario.provincia}
                onChange={cambioInput}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pais">País</label>
              <input
                type="text"
                id="pais"
                name="pais"
                value={Formulario.pais}
                onChange={cambioInput}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nacionalidad">Nacionalidad</label>
              <input
                type="text"
                id="nacionalidad"
                name="nacionalidad"
                value={Formulario.nacionalidad}
                onChange={cambioInput}
                required
              />
            </div>
          </div>

          <div className='grupo-row'>
            <div className="form-group">
              <label htmlFor="ocupacion">Ocupación</label>
              <input
                type="text"
                id="ocupacion"
                name="ocupacion"
                value={Formulario.ocupacion}
                onChange={cambioInput}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn">
              Siguiente
            </button>
            <div className="mt-6 w-full flex justify-end">
              <BotonCancelar />
            </div>
          </div>

        </form>
      </main>

      {PopupExitoso && (
        <div className="popup">
          <div className="popup-contenido">

            <div className='popup-encabezado'>
              <Image className='popup-icono' src="img/iconoExito.svg" alt="icono" width={100} height={30} />
              <div className='popup-descripcion'>
                <h2>
                  Huésped Cargado Exitosamente
                </h2>
                <p>
                  ¿Desea cargar otro huésped?
                </p>
              </div>
            </div>

            <div className='popup-botonera'>
              <button className="popup-boton" onClick={() => { setPopupExitoso(false); resetForm(); }}>
                Sí
              </button>
              <button className="popup-boton" onClick={() => router.push('/menu')}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {DuplicadoPopup && (

        <div className="popup" style={{ display: 'flex' }}>
          <div className="popup-contenido">
            <div className='popup-encabezado'>
              <div className='popup-icono'>
                <Image src="img/iconoAdvertencia.svg" alt="icono" width={100} height={30} />
              </div>
              <div className='popup-descripcion'>
                <h2>
                  Documento ya registrado
                </h2>
                <p>
                  {duplicateMessage}
                </p>
              </div>
            </div>

            <div className='popup-botonera'>
              <button className="popup-boton" onClick={async () => { setDuplicadoPopup(false); await enviarFormulario(true); }}>
                Aceptar Igualmente
              </button>
              <button className="popup-boton" onClick={() => { setDuplicadoPopup(false); document.getElementById('documento')?.focus(); }}>
                Corregir
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
