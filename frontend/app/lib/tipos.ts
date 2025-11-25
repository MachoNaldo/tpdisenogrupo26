// --- Tipo de Unión para replicar el Enum TipoDoc de Java ---
export type TipoDocumento = 'DNI' | 'LE' | 'LC' | 'PASAPORTE' | 'OTRO';

// --- Array para el renderizado del SELECT ---
export const TiposDocumentoArray: TipoDocumento[] = ['DNI', 'LE', 'LC', 'PASAPORTE', 'OTRO'];

// --- Estructura para la Dirección ---
export interface Direccion {
  nombreCalle: string;
  numCalle: string;
  piso: string;
  departamento: string;
  localidad: string;
  codPostal: string;
  provincia: string;
  pais: string;
}

// --- Estructura para la Entidad Huésped ---
export interface Huesped {
  id: number; 
  apellido: string;
  nombres: string;
  tipoDocumento: TipoDocumento; // <--- USANDO EL TIPO DE UNIÓN
  documentacion: string; 
  sexo: 'Masculino' | 'Femenino' | string; 
  fechaNacimiento: string; 
  consumidorFinal: 'A' | 'B' | string; 
  email: string | null;
  cuit: string; 
  direccion: Direccion;
  telefono: string; 
  nacionalidad: string;
  ocupacion: string;
  edad: number;
  hospedado: boolean;
}

// --- Estructura para los Criterios de Búsqueda (Patrón Builder) ---
export interface CriteriosBusqueda {
    apellido: string;
    nombres: string;
    tipoDocumento: TipoDocumento | ''; // <--- USANDO EL TIPO DE UNIÓN, MÁS EL VALOR VACÍO ''
    documento: string; // Corresponde al campo 'documentacion' en Spring
}