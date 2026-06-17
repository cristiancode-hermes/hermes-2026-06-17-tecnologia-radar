import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechnologyService, Technology } from '../../services/technology.service';
import { VoteService, Vote } from '../../services/vote.service';
import { AuthService } from '../../services/auth.service';
import { StarRatingComponent } from '../../shared/star-rating.component';

@Component({
  selector: 'app-technology-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule, StarRatingComponent],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading -->
      @if (loading()) {
        <div class="flex items-center justify-center py-20">
          <div class="text-center">
            <svg class="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p class="text-neutral-500">Cargando...</p>
          </div>
        </div>
      }

      <!-- Error -->
      @if (error()) {
        <div class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">Error</h3>
          <p class="text-neutral-500">{{ error() }}</p>
          <a routerLink="/" class="btn-primary mt-4 inline-block">Volver al radar</a>
        </div>
      }

      <!-- Tech info -->
      @if (tech(); as t) {
        <!-- Back link -->
        <a routerLink="/" class="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-500 mb-6 transition-colors">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver al radar
        </a>

        <!-- Tech Info -->
        <div class="card mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{{ t.name }}</h1>
              <div class="flex items-center gap-2 mt-2">
                <span class="badge-primary">{{ t.category?.name }}</span>
                <span class="badge" [class.badge-success]="t.trend === 'up'" [class.badge-warning]="t.trend === 'down'">
                  @if (t.trend === 'up') {
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                      Subiendo
                    </span>
                  } @else if (t.trend === 'down') {
                    <span class="flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                      Bajando
                    </span>
                  } @else {
                    Estable
                  }
                </span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-primary-500">{{ t.avgScore.toFixed(1) }}</div>
              <p class="text-sm text-neutral-500">{{ t.totalVotes }} votos</p>
            </div>
          </div>
          <p class="text-neutral-600 dark:text-neutral-400 mb-4">{{ t.description }}</p>
          @if (t.website) {
            <a [href]="t.website" target="_blank" rel="noopener" class="inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              {{ t.website }}
            </a>
          }
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Vote Section -->
          <div class="card">
            <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Tu voto</h2>
            @if (auth.isAuthenticated()) {
              @if (existingVote(); as vote) {
                <p class="text-sm text-neutral-500 mb-3">Ya has votado esta tecnología</p>
                <app-star-rating [value]="voteScore" [readonly]="false" size="lg" (valueChange)="onVote($event)"/>
                @if (voteScore > 0) {
                  <textarea
                    [(ngModel)]="voteComment"
                    class="input mt-3"
                    rows="2"
                    placeholder="Agrega un comentario (opcional)"
                  ></textarea>
                  <button (click)="submitVote()" class="btn-primary mt-3" [disabled]="votingLoading()">
                    {{ votingLoading() ? 'Guardando...' : 'Actualizar voto' }}
                  </button>
                }
              } @else {
                <p class="text-sm text-neutral-500 mb-3">¿Qué puntuación le das a esta tecnología?</p>
                <app-star-rating [value]="voteScore" [readonly]="false" size="lg" (valueChange)="onVote($event)"/>
                @if (voteScore > 0) {
                  <textarea
                    [(ngModel)]="voteComment"
                    class="input mt-3"
                    rows="2"
                    placeholder="Agrega un comentario (opcional)"
                  ></textarea>
                  <button (click)="submitVote()" class="btn-primary mt-3" [disabled]="votingLoading()">
                    {{ votingLoading() ? 'Enviando...' : 'Enviar voto' }}
                  </button>
                }
              }
              @if (voteError()) {
                <p class="mt-2 text-sm text-red-500">{{ voteError() }}</p>
              }
              @if (voteSuccess()) {
                <p class="mt-2 text-sm text-green-600">¡Voto registrado correctamente!</p>
              }
            } @else {
              <div class="text-center py-6">
                <p class="text-neutral-500 mb-3">Inicia sesión para votar</p>
                <a routerLink="/login" class="btn-primary">Iniciar sesión</a>
              </div>
            }
          </div>

          <!-- Trend Chart (simplified SVG) -->
          <div class="card">
            <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Evolución de puntuación</h2>
            @if (trendHistory().length > 0) {
              <div class="relative w-full" style="aspect-ratio: 2/1;">
                <svg viewBox="0 0 300 150" class="w-full h-full">
                  <!-- Grid lines -->
                  @for (y of [30, 60, 90, 120]; track y) {
                    <line x1="40" [attr.y1]="y" x2="290" [attr.y2]="y" stroke="currentColor" class="text-neutral-200 dark:text-neutral-700" stroke-width="0.5"/>
                  }
                  <!-- Line -->
                  <polyline
                    [attr.points]="trendLinePoints"
                    fill="none"
                    stroke="#6366f1"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="trend-line"
                  />
                  <!-- Dots -->
                  @for (pt of trendHistory(); track $index) {
                    @let x = 40 + ($index / Math.max(trendHistory().length - 1, 1)) * 250;
                    @let y = 120 - (pt.score / 5) * 90;
                    <circle [attr.cx]="x" [attr.cy]="y" r="3" fill="#6366f1" stroke="white" stroke-width="1.5"/>
                  }
                </svg>
              </div>
            } @else {
              <div class="text-center py-8">
                <p class="text-neutral-400">No hay datos históricos disponibles</p>
              </div>
            }
          </div>
        </div>

        <!-- Comments Section -->
        <div class="card mt-6">
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Comentarios</h2>
          @if (comments().length > 0) {
            <div class="space-y-4">
              @for (vote of comments(); track vote.id) {
                <div class="border-b border-neutral-100 dark:border-neutral-800 pb-4 last:border-0">
                  <div class="flex items-center gap-2 mb-1">
                    <app-star-rating [value]="vote.score" [readonly]="true" size="sm"/>
                    <span class="text-xs text-neutral-400">{{ vote.createdAt | date:'medium' }}</span>
                  </div>
                  @if (vote.comment) {
                    <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ vote.comment }}</p>
                  }
                </div>
              }
            </div>
          } @else {
            <p class="text-neutral-400 text-sm">No hay comentarios aún</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .trend-line {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: dash 1.5s ease forwards;
    }
    @keyframes dash {
      to { stroke-dashoffset: 0; }
    }
  `],
})
export class TechnologyDetailPage {
  private route = inject(ActivatedRoute);
  private techService = inject(TechnologyService);
  private voteService = inject(VoteService);
  protected auth = inject(AuthService);

  protected tech = signal<Technology | null>(null);
  protected loading = signal(true);
  protected error = signal('');

  protected existingVote = signal<Vote | null>(null);
  protected voteScore = 0;
  protected voteComment = '';
  protected votingLoading = signal(false);
  protected voteError = signal('');
  protected voteSuccess = signal(false);

  protected comments = signal<Vote[]>([]);
  protected trendHistory = signal<{ date: string; score: number }[]>([]);
  protected Math = Math;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadTech(id);
    this.loadVotes(id);
    this.loadMyVote(id);
  }

  private loadTech(id: string): void {
    this.techService.getById(id).subscribe({
      next: (t) => {
        this.tech.set(t);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al cargar la tecnología.');
      },
    });
  }

  private loadVotes(technologyId: string): void {
    this.voteService.getAll(technologyId).subscribe({
      next: (votes) => {
        this.comments.set(votes.filter((v) => v.comment));
        // Build trend history from votes
        if (votes.length > 0) {
          const sorted = [...votes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          this.trendHistory.set(sorted.map((v) => ({ date: v.createdAt, score: v.score })));
        }
      },
      error: () => {},
    });
  }

  private loadMyVote(technologyId: string): void {
    if (!this.auth.isAuthenticated()) return;
    this.voteService.getMyVoteForTechnology(technologyId).subscribe({
      next: (vote) => {
        if (vote) {
          this.existingVote.set(vote);
          this.voteScore = vote.score;
          this.voteComment = vote.comment || '';
        }
      },
      error: () => {},
    });
  }

  protected onVote(score: number): void {
    this.voteScore = score;
    this.voteSuccess.set(false);
  }

  protected submitVote(): void {
    if (this.voteScore === 0) return;
    this.votingLoading.set(true);
    this.voteError.set('');
    this.voteSuccess.set(false);

    const data = {
      technologyId: this.tech()!.id,
      score: this.voteScore,
      comment: this.voteComment || undefined,
    };

    const existing = this.existingVote();
    const request = existing
      ? this.voteService.update(existing.id, data)
      : this.voteService.create(data);

    request.subscribe({
      next: () => {
        this.votingLoading.set(false);
        this.voteSuccess.set(true);
        // Reload votes
        this.loadVotes(this.tech()!.id);
        this.loadMyVote(this.tech()!.id);
      },
      error: (err) => {
        this.votingLoading.set(false);
        this.voteError.set(err.error?.message || 'Error al guardar el voto.');
      },
    });
  }

  protected get trendLinePoints(): string {
    const history = this.trendHistory();
    if (history.length === 0) return '';
    return history
      .map((pt, i) => {
        const x = 40 + (i / Math.max(history.length - 1, 1)) * 250;
        const y = 120 - (pt.score / 5) * 90;
        return `${x},${y}`;
      })
      .join(' ');
  }
}
