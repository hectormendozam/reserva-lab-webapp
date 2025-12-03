export type UserRole = 'ADMIN' | 'TECNICO' | 'ESTUDIANTE';

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
  nombre: string;
  edificio: string;
  piso: string;
  capacidad: number;
  tipo: 'COMPUTO' | 'ELECTRONICA' | 'BIOLOGIA' | string;
  status: LabStatus;
}

export type EquipmentStatus = 'DISPONIBLE' | 'MANTENIMIENTO';

export interface Equipment {
  id: number;
  nombre: string;
  descripcion: string;
  numeroInventario: string;
  cantidadTotal: number;
  cantidadDisponible: number;
  status: EquipmentStatus;
  lab?: number; // Lab id opcional
}

export type ReservacionStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'CANCELADO';

export interface Reservacion {
  id: number;
  user: number; // User id
  lab: number; // Lab id
  fecha: string; // ISO date
  horaInicio: string; // HH:mm
  horaFin: string;   // HH:mm
  motivo: string;
  status: ReservacionStatus;
}

export type PrestamoStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'DEVUELTO' | 'DANADO';
export interface Prestamo {
  id: number;
  user: number; // User id
  equipo: number; // Equipment id
  cantidad: number;
  fechaPrestamo: string;      // ISO date - cuando se solicitó
  fechaDevolucion: string;    // ISO date - fecha límite para devolver
  fechaEntrega?: string;      // ISO date opcional - cuando realmente se devolvió
  danado: boolean;
  status: PrestamoStatus;
}
