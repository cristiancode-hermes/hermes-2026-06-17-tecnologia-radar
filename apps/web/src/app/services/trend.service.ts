import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface TrendItem {
  technologyId: number;
  name?: string;
  description?: string;
  currentAvg: number;
  previousAvg: number;
  change: number;
  voteCount: number;
}

export interface TrendsResponse {
  period: string;
  rising: TrendItem[];
  declining: TrendItem[];
  stable: TrendItem[];
}

@Injectable({ providedIn: 'root' })
export class TrendService {
  private api = inject(ApiService);

  getTrends(period: string = 'month', limit: number = 10): Observable<TrendsResponse> {
    return this.api.http.get<TrendsResponse>(`${this.api.baseUrl}/trends`, {
      headers: this.api.headers,
      params: { period, limit: String(limit) },
    });
  }
}
