export type UserRole = 'ADMIN' | 'TECH' | 'ESTUDIANTE';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  matricula: string;
  role: UserRole;
}

export type LabStatus = 'ACTIVO' | 'INACTIVO' | 'MANTENIMIENTO';

export interface Lab {
  id: number;
  name: string;
  edificio: string;
  piso: string;
  capacidad: number;
  tipo: 'COMPUTO' | 'ELECTRONICA' | 'BIOLOGIA' | string;
  status: LabStatus;
}

export type EquipmentStatus = 'DISPONIBLE' | 'MANTENIMIENTO';

export interface Equipment {
  id: number;
  name: string;
  descripcion: string;
  numeroInventario: string;
  cantidadTotal: number;
  cantidadDisponible: number;
  status: EquipmentStatus;
  lab?: number; // Lab id opcional
}

export type ReservationStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'CANCELADO';

export interface Reservation {
  id: number;
  user: number; // User id
  lab: number; // Lab id
  fecha: string; // ISO date
  horaInicio: string; // HH:mm
  horaFin: string;   // HH:mm
  motivo: string;
  status: ReservationStatus;
}

export type LoanStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'DEVUELTO' | 'DAÑADO';
export interface Loan {
  id: number;
  user: number; // User id
  equipo: number; // Equipment id
  cantidad: number;
  fechaPrestamo: string;    // ISO date
  fechaVencimiento: string;     // ISO date
  fechaDevolucion?: string; // ISO date opcional
  status: LoanStatus;
}
