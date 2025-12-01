import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Prestamo } from '../shared/models';

export interface PrestamoQuery {
  user?: number;
  status?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({ providedIn: 'root' })
export class LoansService {
  private readonly baseUrl = environment.url_api + '/api/loans';

  constructor(private http: HttpClient) {}

  list(params?: PrestamoQuery): Observable<Prestamo[]> {
    let httpParams = new HttpParams();
    if (params?.user) httpParams = httpParams.set('user', params.user);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<PaginatedResponse<Prestamo>>(`${this.baseUrl}/`, { params: httpParams })
      .pipe(map(response => response.results));
  }

  create(payload: Partial<Prestamo>): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.baseUrl}/`, payload);
  }

  approve(id: number): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.baseUrl}/${id}/approve/`, {});
  }

  reject(id: number): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.baseUrl}/${id}/reject/`, {});
  }

  return(id: number, damaged: boolean = false): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.baseUrl}/${id}/return/`, { damaged });
  }
}
