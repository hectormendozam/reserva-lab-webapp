import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Loan } from '../shared/models';

export interface LoanQuery {
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

  list(params?: LoanQuery): Observable<Loan[]> {
    let httpParams = new HttpParams();
    if (params?.user) httpParams = httpParams.set('user', params.user);
    if (params?.status) httpParams = httpParams.set('status', params.status);
    return this.http.get<PaginatedResponse<Loan>>(`${this.baseUrl}/`, { params: httpParams })
      .pipe(map(response => response.results));
  }

  create(payload: Partial<Loan>): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/`, payload);
  }

  approve(id: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/${id}/approve/`, {});
  }

  reject(id: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/${id}/reject/`, {});
  }

  return(id: number, damaged: boolean = false): Observable<Loan> {
    return this.http.post<Loan>(`${this.baseUrl}/${id}/return/`, { damaged });
  }
}
