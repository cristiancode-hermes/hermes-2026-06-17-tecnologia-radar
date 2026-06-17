import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RadarService, RadarData, RadarDataPoint } from '../../services/radar.service';
import { CategoryService, Category } from '../../services/category.service';
import { TechnologyService, Technology } from '../../services/technology.service';

@Component({
  selector: 'app-radar-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Tech Radar</h1>
        <p class="text-neutral-500 mt-1">Visualiza y descubre tendencias tecnológicas</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-8">
        <div class="w-full sm:w-auto">
          <select
            [(ngModel)]="selectedCategory"
            (ngModelChange)="onFilterChange()"
            class="input !w-full sm:!w-48"
          >
            <option value="">Todas las categorías</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.id">{{ cat.name }}</option>
            }
          </select>
        </div>
        <div class="w-full sm:w-auto">
          <select
            [(ngModel)]="selectedPeriod"
            (ngModelChange)="onFilterChange()"
            class="input !w-full sm:!w-40"
          >
            <option value="all">Todo</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Año</option>
          </select>
        </div>
        <div class="w-full sm:w-auto">
          <select
            [(ngModel)]="selectedMinScore"
            (ngModelChange)="onFilterChange()"
            class="input !w-full sm:!w-40"
          >
            <option value="0">Puntuación mínima: 0</option>
            <option value="1">Puntuación mínima: 1</option>
            <option value="2">Puntuación mínima: 2</option>
            <option value="3">Puntuación mínima: 3</option>
            <option value="4">Puntuación mínima: 4</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex items-center justify-center py-20">
          <div class="text-center">
            <svg class="animate-spin h-10 w-10 text-primary-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p class="text-neutral-500">Cargando radar...</p>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <div class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">Error al cargar el radar</h3>
          <p class="text-neutral-500 mb-4">{{ error() }}</p>
          <button (click)="loadData()" class="btn-primary">Reintentar</button>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && !error() && radarData()?.technologies?.length === 0) {
        <div class="text-center py-20">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
            <svg class="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No hay tecnologías</h3>
          <p class="text-neutral-500">No se encontraron tecnologías con los filtros seleccionados.</p>
        </div>
      }

      <!-- Radar Chart + List -->
      @if (!loading() && !error() && radarData() && radarData()!.technologies.length > 0) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Radar Chart -->
          <div class="lg:col-span-2">
            <div class="card">
              <div class="relative w-full" style="aspect-ratio: 1/1; max-width: 600px; margin: 0 auto;">
                <svg
                  #radarSvg
                  viewBox="0 0 400 400"
                  class="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- Background rings -->
                  @for (ring of [80, 160, 240, 320]; track ring) {
                    @for (cat of radarData()!.categories; track cat; let i = $index, total = $count) {
                      @let angle = (i * 2 * Math.PI / total) - Math.PI / 2;
                      @let nextAngle = ((i + 1) * 2 * Math.PI / total) - Math.PI / 2;
                      <polygon
                        [attr.points]="
                          200 + ring * Math.cos(angle) + ',' + (200 + ring * Math.sin(angle)) + ' ' +
                          200 + ring * Math.cos(nextAngle) + ',' + (200 + ring * Math.sin(nextAngle))
                        "
                        fill="none"
                        stroke="currentColor"
                        [class.text-neutral-200]="true"
                        [class.dark:text-neutral-700]="true"
                        stroke-width="0.5"
                      />
                    }
                  }
                  <!-- Ring circles -->
                  @for (ring of [80, 160, 240, 320]; track ring) {
                    <circle cx="200" cy="200" [attr.r]="ring" fill="none" stroke="currentColor" class="text-neutral-200 dark:text-neutral-700" stroke-width="0.5"/>
                  }
                  <!-- Axis lines and labels -->
                  @for (cat of radarData()!.categories; track cat.id; let i = $index, total = $count) {
                    @let angle = (i * 2 * Math.PI / total) - Math.PI / 2;
                    <line
                      x1="200" y1="200"
                      [attr.x2]="200 + 340 * Math.cos(angle)"
                      [attr.y2]="200 + 340 * Math.sin(angle)"
                      stroke="currentColor"
                      class="text-neutral-300 dark:text-neutral-600"
                      stroke-width="1"
                    />
                    <text
                      [attr.x]="200 + 360 * Math.cos(angle)"
                      [attr.y]="200 + 360 * Math.sin(angle)"
                      text-anchor="middle"
                      dominant-baseline="middle"
                      class="text-[10px]"
                      [attr.fill]="cat.color"
                    >
                      {{ cat.name }}
                    </text>
                  }
                  <!-- Data points -->
                  @for (point of radarData()!.technologies; track point.technologyId) {
                    @let catIndex = radarData()!.categories.findIndex(c => c.id === point.categoryId);
                    @let total = radarData()!.categories.length;
                    @let angle = (catIndex * 2 * Math.PI / total) - Math.PI / 2;
                    @let distance = 40 + (point.score / 5) * 280;
                    @let x = 200 + distance * Math.cos(angle);
                    @let y = 200 + distance * Math.sin(angle);
                    @let catColor = radarData()!.categories.find(c => c.id === point.categoryId)?.color || '#6366f1';
                    <g
                      class="cursor-pointer radar-point"
                      (click)="goToTech(point.technologyId)"
                      (mouseenter)="hoveredTech.set(point)"
                      (mouseleave)="hoveredTech.set(null)"
                      [attr.data-tech-id]="point.technologyId"
                    >
                      <circle
                        [attr.cx]="x" [attr.cy]="y"
                        r="5"
                        [attr.fill]="catColor"
                        class="transition-all duration-300 hover:r-7 hover:opacity-80"
                        stroke="white"
                        stroke-width="2"
                      />
                    </g>
                  }
                </svg>

                <!-- Tooltip -->
                @if (hoveredTech(); as tech) {
                  <div
                    class="absolute pointer-events-none bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-sm"
                    style="top: 50%; left: 50%; transform: translate(-50%, -60%);"
                  >
                    <p class="font-medium text-neutral-900 dark:text-neutral-100">{{ tech.name }}</p>
                    <p class="text-neutral-500">Score: {{ tech.score.toFixed(1) }}</p>
                    <p class="text-neutral-500">Votos: {{ tech.votes }}</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Technology List -->
          <div class="lg:col-span-1">
            <div class="card">
              <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Tecnologías</h2>
              <div class="space-y-3 max-h-[600px] overflow-y-auto">
                @for (tech of radarData()!.technologies; track tech.technologyId) {
                  <a
                    [routerLink]="['/technology', tech.technologyId]"
                    class="block p-3 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="font-medium text-sm text-neutral-900 dark:text-neutral-100">{{ tech.name }}</p>
                        <p class="text-xs text-neutral-500">{{ tech.category }}</p>
                      </div>
                      <div class="text-right">
                        <p class="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{{ tech.score.toFixed(1) }}</p>
                        <p class="text-xs text-neutral-400">{{ tech.votes }} votos</p>
                      </div>
                    </div>
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class RadarPage {
  private radarService = inject(RadarService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  protected radarData = signal<RadarData | null>(null);
  protected categories = signal<Category[]>([]);
  protected loading = signal(true);
  protected error = signal('');
  protected hoveredTech = signal<RadarDataPoint | null>(null);

  protected selectedCategory = '';
  protected selectedPeriod = 'all';
  protected selectedMinScore = '0';

  // Access Math.PI for template
  protected Math = Math;

  constructor() {
    this.loadCategories();
    this.loadData();
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => {},
    });
  }

  protected loadData(): void {
    this.loading.set(true);
    this.error.set('');
    const period = this.selectedPeriod !== 'all' ? this.selectedPeriod : undefined;
    const minScore = Number(this.selectedMinScore);
    this.radarService.getData(period, minScore > 0 ? minScore : undefined).subscribe({
      next: (data) => {
        let filtered = data;
        if (this.selectedCategory) {
          filtered = {
            ...data,
            technologies: data.technologies.filter((t) => t.categoryId === this.selectedCategory),
          };
        }
        this.radarData.set(filtered);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al cargar los datos del radar.');
      },
    });
  }

  protected onFilterChange(): void {
    this.loadData();
  }

  protected goToTech(id: string): void {
    this.router.navigate(['/technology', id]);
  }
}
