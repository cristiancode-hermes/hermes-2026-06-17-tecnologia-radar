import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserStats {
  totalVotes: number;
  avgScore: number;
  categoriesVoted: number;
  votesByCategory: { category: string; count: number; color: string }[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = inject(ApiService);

  getStats(): Observable<UserStats> {
    return this.api.http.get<UserStats>(`${this.api.baseUrl}/dashboard/stats`, {
      headers: this.api.headers,
    });
  }
}
