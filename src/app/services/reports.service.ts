import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OccupancyReport {
  lab_id: number;
  lab_name: string;
  period: string;
  occupancy_rate: number;
}

export interface EquipmentUsageReport {
  equipment_id: number;
  equipment_name: string;
  total_loans: number;
}

export interface IncidentReport {
  loan_id: number;
  equipment_name: string;
  damage_type: string;
  reported_at: string;
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
