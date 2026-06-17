import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DashboardService, UserStats } from '../../services/dashboard.service';
import { VoteService, Vote } from '../../services/vote.service';
import { StarRatingComponent } from '../../shared/star-rating.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [DatePipe, StarRatingComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
        <p class="text-neutral-500 mt-1">Tu actividad en Tech Radar</p>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="flex items-center justify-center py-20">
          <div class="text-center">
            <svg class="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p class="text-neutral-500">Cargando dashboard...</p>
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
          <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">Error al cargar dashboard</h3>
          <p class="text-neutral-500">{{ error() }}</p>
        </div>
      }

      @if (!loading() && !error()) {
        <!-- Stats Cards -->
        @if (stats(); as s) {
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div class="card text-center">
              <p class="text-3xl font-bold text-primary-500">{{ s.totalVotes }}</p>
              <p class="text-sm text-neutral-500 mt-1">Votos emitidos</p>
            </div>
            <div class="card text-center">
              <p class="text-3xl font-bold text-secondary-500">{{ s.avgScore.toFixed(1) }}</p>
              <p class="text-sm text-neutral-500 mt-1">Puntuación promedio</p>
            </div>
            <div class="card text-center">
              <p class="text-3xl font-bold text-accent-500">{{ s.categoriesVoted }}</p>
              <p class="text-sm text-neutral-500 mt-1">Categorías votadas</p>
            </div>
          </div>

          <!-- Category Distribution -->
          @if (s.votesByCategory.length > 0) {
            <div class="card mb-8">
              <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Distribución por categoría</h2>
              <div class="space-y-3">
                @for (cat of s.votesByCategory; track cat.category) {
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-neutral-700 dark:text-neutral-300">{{ cat.category }}</span>
                      <span class="text-neutral-500">{{ cat.count }} votos</span>
                    </div>
                    <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div
                        class="h-2 rounded-full transition-all duration-500"
                        [style.width.%]="(cat.count / maxCategoryCount) * 100"
                        [style.background-color]="cat.color"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }

        <!-- My Votes -->
        <div class="card">
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Mis votos</h2>
          @if (myVotes().length === 0) {
            <p class="text-neutral-400 text-sm">Aún no has votado ninguna tecnología</p>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-neutral-200 dark:border-neutral-700">
                    <th class="text-left py-2 px-2 text-neutral-500 font-medium">Tecnología</th>
                    <th class="text-left py-2 px-2 text-neutral-500 font-medium">Categoría</th>
                    <th class="text-center py-2 px-2 text-neutral-500 font-medium">Puntuación</th>
                    <th class="text-right py-2 px-2 text-neutral-500 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  @for (vote of myVotes(); track vote.id) {
                    <tr class="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                      <td class="py-3 px-2 font-medium text-neutral-900 dark:text-neutral-100">{{ vote.technology?.name }}</td>
                      <td class="py-3 px-2 text-neutral-500">{{ vote.technology?.category?.name }}</td>
                      <td class="py-3 px-2 text-center">
                        <app-star-rating [value]="vote.score" [readonly]="true" size="sm"/>
                      </td>
                      <td class="py-3 px-2 text-right text-neutral-400">{{ vote.createdAt | date:'short' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DashboardPage {
  private dashboardService = inject(DashboardService);
  private voteService = inject(VoteService);

  protected loading = signal(true);
  protected error = signal('');
  protected stats = signal<UserStats | null>(null);
  protected myVotes = signal<Vote[]>([]);
  protected maxCategoryCount = 1;

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.dashboardService.getStats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.maxCategoryCount = Math.max(...s.votesByCategory.map((c) => c.count), 1);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar estadísticas.');
        this.loading.set(false);
      },
    });

    this.voteService.getMyVotes().subscribe({
      next: (votes) => {
        this.myVotes.set(votes);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
