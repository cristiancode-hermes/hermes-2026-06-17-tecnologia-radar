import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Vote {
  id: string;
  userId: string;
  technologyId: string;
  score: number;
  comment: string;
  technology?: { id: string; name: string; category?: { name: string } };
  createdAt: string;
}

export interface CreateVoteDto {
  technologyId: string;
  score: number;
  comment?: string;
}

@Injectable({ providedIn: 'root' })
export class VoteService {
  private api = inject(ApiService);

  getAll(technologyId?: string): Observable<Vote[]> {
    const params: Record<string, string> = {};
    if (technologyId) params['technologyId'] = technologyId;
    return this.api.http.get<Vote[]>(`${this.api.baseUrl}/votes`, {
      headers: this.api.headers,
      params,
    });
  }

  getMyVotes(): Observable<Vote[]> {
    return this.api.http.get<Vote[]>(`${this.api.baseUrl}/votes/mine`, {
      headers: this.api.headers,
    });
  }

  create(data: CreateVoteDto): Observable<Vote> {
    return this.api.http.post<Vote>(`${this.api.baseUrl}/votes`, data, {
      headers: this.api.headers,
    });
  }

  update(id: string, data: Partial<CreateVoteDto>): Observable<Vote> {
    return this.api.http.patch<Vote>(`${this.api.baseUrl}/votes/${id}`, data, {
      headers: this.api.headers,
    });
  }

  getMyVoteForTechnology(technologyId: string): Observable<Vote | null> {
    return this.api.http.get<Vote | null>(`${this.api.baseUrl}/votes/mine/${technologyId}`, {
      headers: this.api.headers,
    });
  }
}
