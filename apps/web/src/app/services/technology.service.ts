import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Technology {
  id: string;
  name: string;
  description: string;
  website: string;
  categoryId: string;
  category?: { id: string; name: string };
  avgScore: number;
  totalVotes: number;
  trend: 'up' | 'down' | 'stable';
  createdAt: string;
}

export interface TechnologyFilters {
  categoryId?: string;
  search?: string;
  minScore?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class TechnologyService {
  private api = inject(ApiService);

  getAll(filters?: TechnologyFilters): Observable<Technology[]> {
    const params: Record<string, string> = {};
    if (filters?.categoryId) params['categoryId'] = filters.categoryId;
    if (filters?.search) params['search'] = filters.search;
    if (filters?.minScore !== undefined) params['minScore'] = String(filters.minScore);
    if (filters?.sortBy) params['sortBy'] = filters.sortBy;
    if (filters?.sortOrder) params['sortOrder'] = filters.sortOrder;
    return this.api.http.get<Technology[]>(`${this.api.baseUrl}/technologies`, {
      headers: this.api.headers,
      params,
    });
  }

  getById(id: string): Observable<Technology> {
    return this.api.http.get<Technology>(`${this.api.baseUrl}/technologies/${id}`, {
      headers: this.api.headers,
    });
  }

  create(data: Partial<Technology>): Observable<Technology> {
    return this.api.http.post<Technology>(`${this.api.baseUrl}/technologies`, data, {
      headers: this.api.headers,
    });
  }

  update(id: string, data: Partial<Technology>): Observable<Technology> {
    return this.api.http.patch<Technology>(`${this.api.baseUrl}/technologies/${id}`, data, {
      headers: this.api.headers,
    });
  }

  delete(id: string): Observable<void> {
    return this.api.http.delete<void>(`${this.api.baseUrl}/technologies/${id}`, {
      headers: this.api.headers,
    });
  }
}
