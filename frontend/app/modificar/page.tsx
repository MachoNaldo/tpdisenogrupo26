'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import '../crearhuesped/crearhuesped.css';
import '../styles/estilos.css';

type DireccionDTO = {
  codPostal: string;
  departamento: string;
  localidad: string;
  nombreCalle: string;
  numCalle: number;
  pais: string;
  piso: string;
  provincia: string;
};

type HuespedDTO = {
  id?: number;
  apellido: string;
  condicionFiscal: string;
  cuit: string;
  direccion: DireccionDTO;
  documentacion: string;
  email: string;
  fechaNacimiento: string;
  nacionalidad: string;
  nombres: string;
  ocupacion: string;
  sexo: string;
  telefono: string;
  tipoDocumento: string;
  edad?: number;
};

interface GeoRefProvincia {
  id: string;
  nombre: string;
}

interface GeoRefLocalidad {
  id: string;
  nombre: string;
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

function splitFecha(fecha: string | null | undefined) {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return { dia: '', mes: '', anio: '' };
  const [anio, mes, dia] = fecha.split('-');
  return { anio, mes: String(Number(mes)), dia: String(Number(dia)) };
}

function splitTelefono(raw: string | null | undefined) {
  const s = (raw ?? '').trim();
  if (!s) return { codigoPais: '+#', telefono: '' };

  const m = s.match(/^(\+\d+)\s*(.*)$/);
  if (!m) return { codigoPais: '+#', telefono: s.replace(/\D/g, '') };

  return {
    codigoPais: m[1] || '+#',
    telefono: (m[2] ?? '').replace(/\D/g, '')
  };
}

export default function ModificarHuesped() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [provincias, setProvincias] = useState<GeoRefProvincia[]>([]);
  const [localidades, setLocalidades] = useState<GeoRefLocalidad[]>([]);
  const [cargandoLocalidades, setCargandoLocalidades] = useState(false);

  const [Formulario, setFormulario] = useState({
    apellido: '',
    nombres: '',
    tipoDocumento: '',
    documento: '',
    dia: '',
    mes: '',
    anio: '',
    sexo: '',
    condicionFiscal: '',
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

  // Si el usuario modifica un campo se aplica color azul
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const styleValor = (fieldName: string): React.CSSProperties =>
    touched[fieldName] ? { color: '#5a8fb8' } : {};

  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentYear = new Date().getFullYear();
  const anios = Array.from({ length: 101 }, (_, i) => currentYear - i);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/revisar-sesion`, {
          credentials: 'include',
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        if (!data.autenticado) router.push('/login');
      } catch {
        router.push('/login');
      }
    };

    verificarSesion();
  }, [router]);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const res = await fetch('https://apis.datos.gob.ar/georef/api/provincias?orden=nombre');
        const data = await res.json();
        setProvincias(data.provincias);
      } catch (error) {
        console.error('Error al cargar provincias', error);
      }
    };
    fetchProvincias();
  }, []);

  const cargarLocalidades = async (nombreProvincia: string) => {
    if (!nombreProvincia) {
      setLocalidades([]);
      return;
    }
    setCargandoLocalidades(true);
    try {
      const res = await fetch(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${nombreProvincia}&orden=nombre&max=1000`
      );
      const data = await res.json();
      setLocalidades(data.localidades);
    } catch (error) {
      console.error('Error al cargar localidades', error);
    } finally {
      setCargandoLocalidades(false);
    }
  };

  const cambioProvincia = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
      localidad: ''
    }));
    setTouched((prev) => ({ ...prev, [name]: true, localidad: true }));

    cargarLocalidades(value);
  };

  const renderHeader = () => (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#000',
        borderBottom: '2px solid #b8975a'
      }}
    >
      <h1
        className="font-serif"
        style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontStyle: 'italic', color: '#d8a85b' }}
      >
        Modificar huésped
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Image src="/img/Logotipo3.png" alt="Logo" width={80} height={80} className="opacity-45" />
      </div>
    </header>
  );

  const cambioInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const cambioInputNumero = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const valorNumerico = value.replace(/\D/g, '');
    setFormulario((prev) => ({ ...prev, [name]: valorNumerico }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const cambioCuitFormateado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormulario((prev) => ({ ...prev, cuit: normalizarCuit(value) }));
    setTouched((prev) => ({ ...prev, cuit: true }));
  };

  useEffect(() => {
    const cargarHuesped = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const id = Number(idParam);

      if (!idParam || !Number.isFinite(id) || id <= 0) {
        alert('ID inválido. No se puede modificar.');
        router.push('/menu');
        return;
      }

      setCargando(true);

      try {
        const res = await fetch(`${baseUrl}/api/huespedes/${id}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          const txt = await res.text().catch(() => '');
          throw new Error(txt || `Error HTTP: ${res.status}`);
        }

        const data: HuespedDTO = await res.json();

        const { dia, mes, anio } = splitFecha(data.fechaNacimiento);
        const tel = splitTelefono(data.telefono);

        const pais = data.direccion?.pais ?? '';
        const provincia = data.direccion?.provincia ?? '';

        if ((pais ?? '').toLowerCase() === 'argentina' || pais === '') {
          if (provincia) await cargarLocalidades(provincia);
        } else {
          setLocalidades([]);
        }
        setFormulario({
          apellido: data.apellido ?? '',
          nombres: data.nombres ?? '',
          tipoDocumento: data.tipoDocumento ?? '',
          documento: data.documentacion ?? '',
          dia,
          mes,
          anio,
          sexo: data.sexo ?? '',
          condicionFiscal: data.condicionFiscal ?? '',
          email: data.email ?? '',
          cuit: normalizarCuit(data.cuit ?? ''),
          calle: data.direccion?.nombreCalle ?? '',
          numero: String(data.direccion?.numCalle ?? ''),
          piso: data.direccion?.piso ?? '',
          departamento: data.direccion?.departamento ?? '',
          localidad: data.direccion?.localidad ?? '',
          codigoPostal: data.direccion?.codPostal ?? '',
          codigoPais: tel.codigoPais,
          telefono: tel.telefono,
          provincia,
          pais,
          nacionalidad: data.nacionalidad ?? '',
          ocupacion: data.ocupacion ?? ''
        });






        setTouched({});
      } catch (err) {
        console.error(err);
        alert('No se pudo cargar el huésped seleccionado.');
        router.push('/menu');
      } finally {
        setCargando(false);
      }
    };

    cargarHuesped();
  }, [idParam, router]);

  const requiereCuit =
    Formulario.condicionFiscal === 'MONOTRIBUTISTA' || Formulario.condicionFiscal === 'RESPONSABLE_INSCRIPTO';

  const construirPayload = (): HuespedDTO => {
    const dia = Formulario.dia.padStart(2, '0');
    const mes = Formulario.mes.padStart(2, '0');
    const anio = Formulario.anio;

    const numCalle = Number((Formulario.numero ?? '').replace(/\D/g, '')) || 0;




    return {
      apellido: Formulario.apellido,
      nombres: Formulario.nombres,
      tipoDocumento: Formulario.tipoDocumento,
      documentacion: Formulario.documento,
      sexo: Formulario.sexo,
      fechaNacimiento: `${anio}-${mes}-${dia}`,
      condicionFiscal: Formulario.condicionFiscal,
      email: Formulario.email,
      cuit: cuitSoloDigitos(Formulario.cuit),
      direccion: {
        nombreCalle: Formulario.calle,
        numCalle,
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
    } as HuespedDTO;
  };

  const enviarModificacion = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const id = Number(idParam);

    if (!idParam || !Number.isFinite(id) || id <= 0) {
      alert('ID inválido.');
      return;
    }

    if (requiereCuit && !cuitSoloDigitos(Formulario.cuit)) {
      alert('CUIT es obligatorio para la condición fiscal seleccionada.');
      return;
    }

    const datos = construirPayload();

    try {
      setGuardando(true);
  
      
      const res = await fetch(`${baseUrl}/api/huespedes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
        credentials: 'include',
      });

      if (res.ok) {
        alert('Huésped modificado correctamente.');
        router.push('/menu');
        return;
      }

      const mensaje = await res.text().catch(() => '');
      alert(mensaje || 'Error al modificar huésped.');
    } catch {
      alert('Error de conexión con el servidor');
    } finally {
      setGuardando(false);
    }
  };

  const subirFormulario = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await enviarModificacion();
  };

  const cancelar = () => {
    router.push('/menu');
  };

  return (
    <>
      {renderHeader()}
      <main className="crearhuesped-bg">
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>
            Cargando datos del huésped...
          </div>
        ) : (
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
                  style={styleValor('apellido')}
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
                  style={styleValor('nombres')}
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
                  style={styleValor('tipoDocumento')}
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
                  style={styleValor('documento')}
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
                    style={styleValor('dia')}
                  >
                    <option value="">Día</option>
                    {dias.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>

                  <select
                    id="mes"
                    name="mes"
                    value={Formulario.mes}
                    onChange={cambioInput}
                    required
                    style={styleValor('mes')}
                  >
                    <option value="">Mes</option>
                    {meses.map((m, i) => (
                      <option key={i} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    id="anio"
                    name="anio"
                    value={Formulario.anio}
                    onChange={cambioInput}
                    required
                    style={styleValor('anio')}
                  >
                    <option value="">Año</option>
                    {anios.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
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
                  style={styleValor('sexo')}
                >
                  <option value="">---</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="condicionFiscal">Condición frente al IVA</label>
                <select
                  id="condicionFiscal"
                  name="condicionFiscal"
                  value={Formulario.condicionFiscal}
                  onChange={cambioInput}
                  required
                  style={styleValor('condicionFiscal')}
                >
                  <option value="">--- Seleccione ---</option>
                  <option value="CONSUMIDOR_FINAL">Consumidor Final</option>
                  <option value="MONOTRIBUTISTA">Monotributista</option>
                  <option value="RESPONSABLE_INSCRIPTO">Responsable Inscripto</option>
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
                  style={styleValor('email')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cuit">
                  CUIT {requiereCuit ? <span style={{ color: 'red' }}>* (Obligatorio)</span> : '(opcional)'}
                </label>
                <input
                  type="text"
                  id="cuit"
                  name="cuit"
                  placeholder="##-########-#"
                  value={Formulario.cuit}
                  onChange={cambioCuitFormateado}
                  inputMode="numeric"
                  required={requiereCuit}
                  className={requiereCuit && !Formulario.cuit ? 'input-error' : ''}
                  style={styleValor('cuit')}
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
                  style={styleValor('calle')}
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
                  style={styleValor('numero')}
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
                  style={styleValor('piso')}
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
                  style={styleValor('departamento')}
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
                  style={styleValor('codigoPostal')}
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
                    style={{ ...styleValor('codigoPais'), maxWidth: '100px' }}
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
                    style={{ ...styleValor('telefono'), flex: 1 }}
                    value={Formulario.telefono}
                    onChange={cambioInputNumero}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row three-col">
              <div className="form-group">
                <label htmlFor="pais">País</label>
                <input
                  type="text"
                  id="pais"
                  name="pais"
                  value={Formulario.pais}
                  onChange={cambioInput}
                  placeholder="Ej: Argentina"
                  required
                  style={styleValor('pais')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="provincia">Provincia</label>
                {Formulario.pais.toLowerCase() === 'argentina' || Formulario.pais === '' ? (
                  <select
                    id="provincia"
                    name="provincia"
                    value={Formulario.provincia}
                    onChange={cambioProvincia}
                    required
                    style={styleValor('provincia')}
                  >
                    <option value="">Seleccione...</option>
                    {provincias.map((prov) => (
                      <option key={prov.id} value={prov.nombre}>
                        {prov.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="provincia"
                    value={Formulario.provincia}
                    onChange={cambioInput}
                    style={styleValor('provincia')}
                  />
                )}
              </div>

              <div className="form-group">
                <label htmlFor="localidad">Localidad</label>
                {Formulario.pais.toLowerCase() === 'argentina' || Formulario.pais === '' ? (
                  <select
                    id="localidad"
                    name="localidad"
                    value={Formulario.localidad}
                    onChange={cambioInput}
                    disabled={!Formulario.provincia || cargandoLocalidades}
                    required
                    style={styleValor('localidad')}
                  >
                    <option value="">{cargandoLocalidades ? 'Cargando...' : 'Seleccione...'}</option>
                    {localidades.map((loc) => (
                      <option key={loc.id} value={loc.nombre}>
                        {loc.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="localidad"
                    value={Formulario.localidad}
                    onChange={cambioInput}
                    style={styleValor('localidad')}
                  />
                )}
              </div>
            </div>

            <div className="grupo-row">
              <div className="form-group">
                <label htmlFor="ocupacion">Ocupación</label>
                <input
                  type="text"
                  id="ocupacion"
                  name="ocupacion"
                  value={Formulario.ocupacion}
                  onChange={cambioInput}
                  required
                  style={styleValor('ocupacion')}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>

              <div className="mt-6 w-full flex justify-end">
                <button type="button" className="btn" onClick={cancelar} disabled={guardando}>
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
