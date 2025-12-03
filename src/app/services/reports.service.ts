import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OccupancyReport {
  lab_id?: number;
  nombreLab: string;  // Backend usa 'nombre' para el nombre del lab
  fecha?: string;
  horasReservadas?: number;
  estadoReserva?: string;  // Alias por si backend devuelve snake_case
}

export interface EquipmentUsageReport {
  equipo_id: number;
  equipo_name: string;        // Backend devuelve 'equipo_name'
  prestamos_totales: number;
}

export interface IncidentReport {
  loan_id: number;       // ID del préstamo
  nombre: string;        // Nombre del equipo
  tipo_dano: string;     // Tipo de daño (DANADO/DEVUELTO)
  reported_at: string;   // Fecha de reporte (updated_at)
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly baseUrl = environment.url_api + '/api/reports';

  constructor(private http: HttpClient) {}

    occupancy(params?: { date_from?: string; date_to?: string; lab?: number; status?: string }): Observable<OccupancyReport[]> {
    let httpParams = new HttpParams();
    if (params?.date_from) httpParams = httpParams.set('date_from', params.date_from);
    if (params?.date_to) httpParams = httpParams.set('date_to', params.date_to);
    if (params?.lab) httpParams = httpParams.set('lab', params.lab.toString());
    if (params?.status) httpParams = httpParams.set('status', params.status);
    
    return this.http.get<OccupancyReport[]>(`${this.baseUrl}/occupancy/`, { params: httpParams });
  }

  equipmentUsage(params?: { date_from?: string; date_to?: string; status?: string }): Observable<EquipmentUsageReport[]> {
    let httpParams = new HttpParams();
    if (params?.date_from) httpParams = httpParams.set('date_from', params.date_from);
    if (params?.date_to) httpParams = httpParams.set('date_to', params.date_to);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    
    return this.http.get<EquipmentUsageReport[]>(`${this.baseUrl}/equipment-usage/`, { params: httpParams });
  }

  incidents(params?: { date_from?: string; date_to?: string; status?: string }): Observable<IncidentReport[]> {
    let httpParams = new HttpParams();
    if (params?.date_from) httpParams = httpParams.set('date_from', params.date_from);
    if (params?.date_to) httpParams = httpParams.set('date_to', params.date_to);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    
    return this.http.get<IncidentReport[]>(`${this.baseUrl}/incidents/`, { params: httpParams });
  }
}
