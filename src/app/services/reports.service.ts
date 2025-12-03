import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OccupancyReport {
  lab_id?: number;
  nombre: string;  // Backend usa 'nombre' para el nombre del lab
  periodo?: string;
  tasaOcupacion?: number;
  tasa_ocupacion?: number;  // Alias por si backend devuelve snake_case
}

export interface EquipmentUsageReport {
  equipo__nombre?: string;  // Backend agrega por equipo__nombre
  nombre?: string;          // Alias si devuelve nombre directamente
  totalPrestamos?: number;
  total_prestamos?: number; // Alias snake_case
}

export interface IncidentReport {
  idPrestamo: number;
  nombreEquipo: string;
  tipoDano: string;
  fechaReporte: string;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private readonly baseUrl = environment.url_api + '/api/reports';

  constructor(private http: HttpClient) {}

  occupancy(params?: { period?: string }): Observable<OccupancyReport[]> {
    const httpParams = new HttpParams({ fromObject: params ?? {} });
    return this.http.get<OccupancyReport[]>(`${this.baseUrl}/occupancy/`, { params: httpParams });
  }

  equipmentUsage(params?: { from?: string; to?: string }): Observable<EquipmentUsageReport[]> {
    const httpParams = new HttpParams({ fromObject: params ?? {} });
    return this.http.get<EquipmentUsageReport[]>(`${this.baseUrl}/equipment-usage/`, { params: httpParams });
  }

  incidents(params?: { from?: string; to?: string }): Observable<IncidentReport[]> {
    const httpParams = new HttpParams({ fromObject: params ?? {} });
    return this.http.get<IncidentReport[]>(`${this.baseUrl}/incidents/`, { params: httpParams });
  }
}
