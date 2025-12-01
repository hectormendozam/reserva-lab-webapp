import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Reservacion } from '../shared/models';

export interface ReservationQuery {
  user?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly baseUrl = environment.url_api + '/api/reservations';

  constructor(private http: HttpClient) {}

  list(params?: ReservationQuery): Observable<Reservacion[]> {
    let httpParams = new HttpParams();
    if (params?.user) httpParams = httpParams.set('user', params.user);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.date_from) httpParams = httpParams.set('date_from', params.date_from);
    if (params?.date_to) httpParams = httpParams.set('date_to', params.date_to);
    return this.http.get<PaginatedResponse<Reservacion>>(`${this.baseUrl}/`, { params: httpParams })
      .pipe(map(response => response.results));
  }

  create(payload: Partial<Reservacion>): Observable<Reservacion> {
    return this.http.post<Reservacion>(`${this.baseUrl}/`, payload);
  }

  approve(id: number): Observable<Reservacion> {
    return this.http.post<Reservacion>(`${this.baseUrl}/${id}/approve/`, {});
  }

  reject(id: number): Observable<Reservacion> {
    return this.http.post<Reservacion>(`${this.baseUrl}/${id}/reject/`, {});
  }

  cancel(id: number, reason?: string): Observable<Reservacion> {
    return this.http.post<Reservacion>(`${this.baseUrl}/${id}/cancel/`, { reason });
  }
}
