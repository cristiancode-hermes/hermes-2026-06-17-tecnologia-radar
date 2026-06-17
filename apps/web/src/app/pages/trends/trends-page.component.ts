import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TrendService, TrendItem, TrendsResponse } from '../../services/trend.service';

@Component({
  selector: 'app-trends-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Tendencias</h1>
          <p class="text-neutral-500 mt-1">Evolución de puntuaciones en el tiempo</p>
        </div>
        <div class="w-full sm:w-auto">
          <select [(ngModel)]="selectedPeriod" (ngModelChange)="loadTrends()" class="input !w-full sm:!w-48">
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-20">
          <div class="text-center">
            <svg class="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p class="text-neutral-500">Cargando tendencias...</p>
          </div>
        </div>
      }

      @if (error()) {
        <div class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">Error al cargar tendencias</h3>
          <p class="text-neutral-500 mb-4">{{ error() }}</p>
          <button (click)="loadTrends()" class="btn-primary">Reintentar</button>
        </div>
      }

      @if (!loading() && !error()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Rising -->
          <div class="card">
            <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
              En ascenso ({{ data()?.rising?.length || 0 }})
            </h2>
            @if (!data()?.rising?.length) {
              <p class="text-neutral-400 text-sm">No hay tecnologías en ascenso en este período</p>
            } @else {
              <div class="space-y-2">
                @for (item of data()?.rising; track item.technologyId) {
                  <a [routerLink]="['/technology', item.technologyId]" class="flex items-center justify-between p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">{{ item.name || 'Tech #' + item.technologyId }}</p>
                      <span class="text-xs text-neutral-400">{{ item.voteCount }} votos · {{ item.currentAvg.toFixed(1) }} avg</span>
                    </div>
                    <div class="text-right ml-4 flex-shrink-0">
                      <p class="font-semibold text-sm text-green-600 dark:text-green-400">+{{ item.change.toFixed(2) }}</p>
                    </div>
                  </a>
                }
              </div>
            }
          </div>

          <!-- Declining -->
          <div class="card">
            <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
              </svg>
              En declive ({{ data()?.declining?.length || 0 }})
            </h2>
            @if (!data()?.declining?.length) {
              <p class="text-neutral-400 text-sm">No hay tecnologías en declive en este período</p>
            } @else {
              <div class="space-y-2">
                @for (item of data()?.declining; track item.technologyId) {
                  <a [routerLink]="['/technology', item.technologyId]" class="flex items-center justify-between p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">{{ item.name || 'Tech #' + item.technologyId }}</p>
                      <span class="text-xs text-neutral-400">{{ item.voteCount }} votos · {{ item.currentAvg.toFixed(1) }} avg</span>
                    </div>
                    <div class="text-right ml-4 flex-shrink-0">
                      <p class="font-semibold text-sm text-red-600 dark:text-red-400">{{ item.change.toFixed(2) }}</p>
                    </div>
                  </a>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class TrendsPage {
  private trendService = inject(TrendService);

  protected selectedPeriod = 'month';
  protected loading = signal(true);
  protected error = signal('');
  protected data = signal<TrendsResponse | null>(null);

  constructor() {
    this.loadTrends();
  }

  protected loadTrends(): void {
    this.loading.set(true);
    this.error.set('');
    this.trendService.getTrends(this.selectedPeriod).subscribe({
      next: (resp) => {
        this.data.set(resp);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al cargar tendencias. Verifica que el servidor esté funcionando.');
      },
    });
  }
}
