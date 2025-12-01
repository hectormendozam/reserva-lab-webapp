import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../shared/models';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  matricula?: string;
  carrera?: string;
  departamento?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.url_api + '/api/auth';

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login/`, payload);
  }

  register(payload: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register/`, payload);
  }

  me(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me/`);
  }


  getAuthenticatedUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error al obtener usuario autenticado:', error);
      return null;
    }
  }


  getAuthenticatedUserId(): number {
    const user = this.getAuthenticatedUser();
    return user?.id ?? 0;
  }
}
