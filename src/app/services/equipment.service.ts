import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Equipment } from '../shared/models';

export interface EquipmentQuery {
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
export class EquipmentService {
  private readonly baseUrl = environment.url_api + '/api/equipment';

  constructor(private http: HttpClient) {}

  list(params?: EquipmentQuery): Observable<Equipment[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<PaginatedResponse<Equipment>>(`${this.baseUrl}/`, { params: httpParams })
      .pipe(map(response => response.results));
  }

  retrieve(id: number): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.baseUrl}/${id}/`);
  }

  create(payload: Partial<Equipment>): Observable<Equipment> {
    return this.http.post<Equipment>(`${this.baseUrl}/`, payload);
  }

  update(id: number, payload: Partial<Equipment>): Observable<Equipment> {
    return this.http.patch<Equipment>(`${this.baseUrl}/${id}/`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }
}
