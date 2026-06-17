import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface RadarDataPoint {
  technologyId: string;
  name: string;
  category: string;
  categoryId: string;
  score: number;
  votes: number;
}

export interface RadarData {
  categories: { id: string; name: string; color: string }[];
  technologies: RadarDataPoint[];
}

@Injectable({ providedIn: 'root' })
export class RadarService {
  private api = inject(ApiService);

  getData(period?: string, minScore?: number): Observable<RadarData> {
    const params: Record<string, string> = {};
    if (period) params['period'] = period;
    if (minScore !== undefined) params['minScore'] = String(minScore);
    return this.api.http.get<RadarData>(`${this.api.baseUrl}/radar`, {
      headers: this.api.headers,
      params,
    });
  }
}
