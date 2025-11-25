export type CellStatus = 'libre' | 'reservada' | 'fuera' | 'ocupado';

export interface RoomColumn {
  id: string;
  name: string;
  code?: number;
}

export interface Row {
  date: string; // ISO o texto corto
  states: { [roomId: string]: CellStatus };
}