import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Category {
  id: string;
  name: string;
  color: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = inject(ApiService);

  getAll(): Observable<Category[]> {
    return this.api.http.get<Category[]>(`${this.api.baseUrl}/categories`, {
      headers: this.api.headers,
    });
  }

  getById(id: string): Observable<Category> {
    return this.api.http.get<Category>(`${this.api.baseUrl}/categories/${id}`, {
      headers: this.api.headers,
    });
  }

  create(data: Partial<Category>): Observable<Category> {
    return this.api.http.post<Category>(`${this.api.baseUrl}/categories`, data, {
      headers: this.api.headers,
    });
  }

  update(id: string, data: Partial<Category>): Observable<Category> {
    return this.api.http.patch<Category>(`${this.api.baseUrl}/categories/${id}`, data, {
      headers: this.api.headers,
    });
  }

  delete(id: string): Observable<void> {
    return this.api.http.delete<void>(`${this.api.baseUrl}/categories/${id}`, {
      headers: this.api.headers,
    });
  }
}
