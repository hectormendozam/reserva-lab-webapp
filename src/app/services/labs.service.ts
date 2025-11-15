import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Lab } from '../shared/models';

export interface LabQuery {
  search?: string;
  status?: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({ providedIn: 'root' })
export class LabsService {
  private readonly baseUrl = environment.url_api + '/api/labs';

  constructor(private http: HttpClient) {}

  list(params?: LabQuery): Observable<Lab[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<PaginatedResponse<Lab>>(`${this.baseUrl}/`, { params: httpParams })
      .pipe(map(response => response.results));
  }

  retrieve(id: number): Observable<Lab> {
    return this.http.get<Lab>(`${this.baseUrl}/${id}/`);
  }

  create(payload: Partial<Lab>): Observable<Lab> {
    return this.http.post<Lab>(`${this.baseUrl}/`, payload);
  }

  update(id: number, payload: Partial<Lab>): Observable<Lab> {
    return this.http.patch<Lab>(`${this.baseUrl}/${id}/`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }
}
