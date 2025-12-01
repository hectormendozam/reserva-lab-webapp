import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl = environment.url_api + '/api/users';

  constructor(private http: HttpClient) {}

  list(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/`);
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}/`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/`);
  }

  update(id: number | Number, data: any): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}/`, data);
  }
}
