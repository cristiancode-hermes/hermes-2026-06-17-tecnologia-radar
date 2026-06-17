import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TechnologyService, Technology } from '../../services/technology.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Administración</h1>
        <p class="text-neutral-500 mt-1">Gestiona tecnologías y categorías</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-6 border-b border-neutral-200 dark:border-neutral-800">
        <button
          (click)="activeTab.set('technologies')"
          class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
          [class.text-primary-500 border-primary-500]="activeTab() === 'technologies'"
          [class.text-neutral-500 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300]="activeTab() !== 'technologies'"
        >
          Tecnologías
        </button>
        <button
          (click)="activeTab.set('categories')"
          class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
          [class.text-primary-500 border-primary-500]="activeTab() === 'categories'"
          [class.text-neutral-500 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300]="activeTab() !== 'categories'"
        >
          Categorías
        </button>
      </div>

      @if (activeTab() === 'technologies') {
        <!-- Technologies CRUD -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Tecnologías</h2>
            <button (click)="openTechForm(null)" class="btn-primary text-sm">+ Nueva tecnología</button>
          </div>

          @if (techLoading()) {
            <div class="text-center py-8">
              <svg class="animate-spin h-8 w-8 text-primary-500 mx-auto" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          } @else {
            <div class="card overflow-hidden !p-0">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                    <th class="text-left py-3 px-4 text-neutral-500 font-medium">Nombre</th>
                    <th class="text-left py-3 px-4 text-neutral-500 font-medium">Categoría</th>
                    <th class="text-center py-3 px-4 text-neutral-500 font-medium">Score</th>
                    <th class="text-right py-3 px-4 text-neutral-500 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (tech of technologies(); track tech.id) {
                    <tr class="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                      <td class="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">{{ tech.name }}</td>
                      <td class="py-3 px-4 text-neutral-500">{{ tech.category?.name }}</td>
                      <td class="py-3 px-4 text-center">{{ tech.avgScore.toFixed(1) }}</td>
                      <td class="py-3 px-4 text-right">
                        <button (click)="openTechForm(tech)" class="btn-ghost text-xs !px-2 !py-1">Editar</button>
                        <button (click)="confirmDeleteTech(tech)" class="btn-ghost text-xs !px-2 !py-1 text-red-500">Eliminar</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="py-8 text-center text-neutral-400">No hay tecnologías</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }

      @if (activeTab() === 'categories') {
        <!-- Categories CRUD -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Categorías</h2>
            <button (click)="openCategoryForm(null)" class="btn-primary text-sm">+ Nueva categoría</button>
          </div>

          @if (catLoading()) {
            <div class="text-center py-8">
              <svg class="animate-spin h-8 w-8 text-primary-500 mx-auto" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          } @else {
            <div class="card overflow-hidden !p-0">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
                    <th class="text-left py-3 px-4 text-neutral-500 font-medium">Nombre</th>
                    <th class="text-left py-3 px-4 text-neutral-500 font-medium">Color</th>
                    <th class="text-left py-3 px-4 text-neutral-500 font-medium">Descripción</th>
                    <th class="text-right py-3 px-4 text-neutral-500 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (cat of categories(); track cat.id) {
                    <tr class="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                      <td class="py-3 px-4 font-medium text-neutral-900 dark:text-neutral-100">{{ cat.name }}</td>
                      <td class="py-3 px-4">
                        <span class="inline-flex items-center gap-2">
                          <span class="w-4 h-4 rounded-full" [style.background-color]="cat.color"></span>
                          <span class="text-xs text-neutral-500">{{ cat.color }}</span>
                        </span>
                      </td>
                      <td class="py-3 px-4 text-neutral-500 text-xs">{{ cat.description }}</td>
                      <td class="py-3 px-4 text-right">
                        <button (click)="openCategoryForm(cat)" class="btn-ghost text-xs !px-2 !py-1">Editar</button>
                        <button (click)="confirmDeleteCategory(cat)" class="btn-ghost text-xs !px-2 !py-1 text-red-500">Eliminar</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="py-8 text-center text-neutral-400">No hay categorías</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }
    </div>

    <!-- Technology Modal -->
    @if (showTechModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" (click)="closeTechModal()">
        <div class="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-md p-6" (click)="$event.stopPropagation()">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            {{ editingTech() ? 'Editar tecnología' : 'Nueva tecnología' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nombre</label>
              <input [(ngModel)]="techForm.name" class="input" placeholder="Nombre de la tecnología"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Descripción</label>
              <textarea [(ngModel)]="techForm.description" class="input" rows="2" placeholder="Descripción"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Sitio web</label>
              <input [(ngModel)]="techForm.website" class="input" placeholder="https://"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Categoría</label>
              <select [(ngModel)]="techForm.categoryId" class="input">
                <option value="">Seleccionar categoría</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </div>
          </div>
          @if (techFormError()) {
            <p class="text-sm text-red-500 mt-2">{{ techFormError() }}</p>
          }
          <div class="flex justify-end gap-2 mt-6">
            <button (click)="closeTechModal()" class="btn-secondary">Cancelar</button>
            <button (click)="saveTech()" class="btn-primary" [disabled]="techSaving()">
              {{ techSaving() ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Category Modal -->
    @if (showCategoryModal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" (click)="closeCategoryModal()">
        <div class="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-md p-6" (click)="$event.stopPropagation()">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            {{ editingCategory() ? 'Editar categoría' : 'Nueva categoría' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nombre</label>
              <input [(ngModel)]="categoryForm.name" class="input" placeholder="Nombre de la categoría"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Color</label>
              <div class="flex gap-2">
                <input [(ngModel)]="categoryForm.color" class="input" placeholder="#6366f1"/>
                <input type="color" [(ngModel)]="categoryForm.color" class="w-10 h-10 rounded cursor-pointer"/>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Descripción</label>
              <textarea [(ngModel)]="categoryForm.description" class="input" rows="2" placeholder="Descripción"></textarea>
            </div>
          </div>
          @if (catFormError()) {
            <p class="text-sm text-red-500 mt-2">{{ catFormError() }}</p>
          }
          <div class="flex justify-end gap-2 mt-6">
            <button (click)="closeCategoryModal()" class="btn-secondary">Cancelar</button>
            <button (click)="saveCategory()" class="btn-primary" [disabled]="catSaving()">
              {{ catSaving() ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Confirm Delete Dialog -->
    @if (deleteConfirm()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" (click)="deleteConfirm.set(null)">
        <div class="bg-white dark:bg-neutral-900 rounded-lg shadow-xl w-full max-w-sm p-6" (click)="$event.stopPropagation()">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Confirmar eliminación</h3>
          <p class="text-sm text-neutral-500 mb-6">
            ¿Estás seguro de que deseas eliminar "{{ deleteConfirm()?.name }}"? Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end gap-2">
            <button (click)="deleteConfirm.set(null)" class="btn-secondary">Cancelar</button>
            <button (click)="executeDelete()" class="btn-danger" [disabled]="deleting()">
              {{ deleting() ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminPage {
  private techService = inject(TechnologyService);
  private categoryService = inject(CategoryService);

  protected activeTab = signal<'technologies' | 'categories'>('technologies');

  // Technologies
  protected technologies = signal<Technology[]>([]);
  protected techLoading = signal(true);

  // Categories
  protected categories = signal<Category[]>([]);
  protected catLoading = signal(true);

  // Tech Modal
  protected showTechModal = signal(false);
  protected editingTech = signal<Technology | null>(null);
  protected techSaving = signal(false);
  protected techFormError = signal('');
  protected techForm = { name: '', description: '', website: '', categoryId: '' };

  // Category Modal
  protected showCategoryModal = signal(false);
  protected editingCategory = signal<Category | null>(null);
  protected catSaving = signal(false);
  protected catFormError = signal('');
  protected categoryForm = { name: '', color: '#6366f1', description: '' };

  // Delete confirmation
  protected deleteConfirm = signal<{ id: string; name: string; type: 'tech' | 'category' } | null>(null);
  protected deleting = signal(false);

  constructor() {
    this.loadTechnologies();
    this.loadCategories();
  }

  private loadTechnologies(): void {
    this.techLoading.set(true);
    this.techService.getAll().subscribe({
      next: (data) => {
        this.technologies.set(data);
        this.techLoading.set(false);
      },
      error: () => this.techLoading.set(false),
    });
  }

  private loadCategories(): void {
    this.catLoading.set(true);
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.catLoading.set(false);
      },
      error: () => this.catLoading.set(false),
    });
  }

  // Tech CRUD
  protected openTechForm(tech: Technology | null): void {
    this.editingTech.set(tech);
    this.techForm = {
      name: tech?.name || '',
      description: tech?.description || '',
      website: tech?.website || '',
      categoryId: tech?.categoryId || '',
    };
    this.techFormError.set('');
    this.showTechModal.set(true);
  }

  protected closeTechModal(): void {
    this.showTechModal.set(false);
    this.editingTech.set(null);
  }

  protected saveTech(): void {
    if (!this.techForm.name) {
      this.techFormError.set('El nombre es obligatorio');
      return;
    }
    this.techSaving.set(true);
    this.techFormError.set('');

    const data = {
      name: this.techForm.name,
      description: this.techForm.description,
      website: this.techForm.website,
      categoryId: this.techForm.categoryId,
    };

    const request = this.editingTech()
      ? this.techService.update(this.editingTech()!.id, data)
      : this.techService.create(data);

    request.subscribe({
      next: () => {
        this.techSaving.set(false);
        this.closeTechModal();
        this.loadTechnologies();
      },
      error: (err) => {
        this.techSaving.set(false);
        this.techFormError.set(err.error?.message || 'Error al guardar.');
      },
    });
  }

  // Category CRUD
  protected openCategoryForm(cat: Category | null): void {
    this.editingCategory.set(cat);
    this.categoryForm = {
      name: cat?.name || '',
      color: cat?.color || '#6366f1',
      description: cat?.description || '',
    };
    this.catFormError.set('');
    this.showCategoryModal.set(true);
  }

  protected closeCategoryModal(): void {
    this.showCategoryModal.set(false);
    this.editingCategory.set(null);
  }

  protected saveCategory(): void {
    if (!this.categoryForm.name) {
      this.catFormError.set('El nombre es obligatorio');
      return;
    }
    this.catSaving.set(true);
    this.catFormError.set('');

    const data = {
      name: this.categoryForm.name,
      color: this.categoryForm.color,
      description: this.categoryForm.description,
    };

    const request = this.editingCategory()
      ? this.categoryService.update(this.editingCategory()!.id, data)
      : this.categoryService.create(data);

    request.subscribe({
      next: () => {
        this.catSaving.set(false);
        this.closeCategoryModal();
        this.loadCategories();
      },
      error: (err) => {
        this.catSaving.set(false);
        this.catFormError.set(err.error?.message || 'Error al guardar.');
      },
    });
  }

  // Delete
  protected confirmDeleteTech(tech: Technology): void {
    this.deleteConfirm.set({ id: tech.id, name: tech.name, type: 'tech' });
  }

  protected confirmDeleteCategory(cat: Category): void {
    this.deleteConfirm.set({ id: cat.id, name: cat.name, type: 'category' });
  }

  protected executeDelete(): void {
    const item = this.deleteConfirm();
    if (!item) return;
    this.deleting.set(true);

    const request = item.type === 'tech'
      ? this.techService.delete(item.id)
      : this.categoryService.delete(item.id);

    request.subscribe({
      next: () => {
        this.deleting.set(false);
        this.deleteConfirm.set(null);
        if (item.type === 'tech') this.loadTechnologies();
        else this.loadCategories();
      },
      error: () => {
        this.deleting.set(false);
      },
    });
  }
}
