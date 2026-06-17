import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.getProfile().subscribe({
        error: () => this.logout(),
      });
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.access_token);
          this.currentUser.set(res.user);
        })
      );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.api.baseUrl}/auth/register`, { name, email, password })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.access_token);
          this.currentUser.set(res.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<User> {
    return this.http
      .get<{ user: User }>(`${this.api.baseUrl}/auth/profile`, {
        headers: this.api.headers,
      })
      .pipe(
        map((res) => res.user),
        tap((user) => this.currentUser.set(user))
      );
  }
}
