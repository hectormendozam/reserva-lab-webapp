export type UserRole = 'ADMIN' | 'TECH' | 'STUDENT';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  matricula: string;
  role: UserRole;
}

export type LabStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';

export interface Lab {
  id: number;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  type: 'COMPUTO' | 'ELECTRONICA' | 'BIOLOGIA' | string;
  status: LabStatus;
}

export type EquipmentStatus = 'AVAILABLE' | 'MAINTENANCE';

export interface Equipment {
  id: number;
  name: string;
  description: string;
  inventory_number: string;
  total_quantity: number;
  available_quantity: number;
  status: EquipmentStatus;
  lab?: number; // Lab id opcional
}

export type ReservationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Reservation {
  id: number;
  user: number; // User id
  lab: number; // Lab id
  date: string; // ISO date
  start_time: string; // HH:mm
  end_time: string;   // HH:mm
  reason: string;
  status: ReservationStatus;
}

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'DAMAGED';

export interface Loan {
  id: number;
  user: number; // User id
  equipment: number; // Equipment id
  quantity: number;
  loan_date: string;    // ISO date
  due_date: string;     // ISO date
  return_date?: string; // ISO date opcional
  status: LoanStatus;
}
