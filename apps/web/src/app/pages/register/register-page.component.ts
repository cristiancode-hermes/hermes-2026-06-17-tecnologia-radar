import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="card">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 mb-4">
              <svg class="w-6 h-6 text-primary-600 dark:text-primary-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Crear cuenta</h1>
            <p class="text-sm text-neutral-500 mt-1">Regístrate en Tech Radar</p>
          </div>

          @if (error()) {
            <div class="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
              {{ error() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nombre</label>
              <input
                id="name"
                type="text"
                [(ngModel)]="name"
                name="name"
                class="input"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
              <input
                id="email"
                type="email"
                [(ngModel)]="email"
                name="email"
                class="input"
                placeholder="tu@email.com"
                required
                autocomplete="email"
              />
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Contraseña</label>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                class="input"
                placeholder="Mínimo 8 caracteres"
                required
                autocomplete="new-password"
              />
              @if (password && password.length < 8) {
                <p class="mt-1 text-xs text-red-500">La contraseña debe tener al menos 8 caracteres</p>
              }
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                class="input"
                placeholder="Repite la contraseña"
                required
              />
              @if (confirmPassword && password !== confirmPassword) {
                <p class="mt-1 text-xs text-red-500">Las contraseñas no coinciden</p>
              }
            </div>

            <button type="submit" class="btn-primary w-full" [disabled]="loading() || !isFormValid()">
              @if (loading()) {
                <span class="inline-flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creando cuenta...
                </span>
              } @else {
                Crear cuenta
              }
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-neutral-500">
            ¿Ya tienes cuenta?
            <a routerLink="/login" class="text-primary-500 hover:text-primary-600 font-medium">Inicia sesión</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected name = '';
  protected email = '';
  protected password = '';
  protected confirmPassword = '';
  protected loading = signal(false);
  protected error = signal('');

  protected isFormValid(): boolean {
    return (
      this.name.length > 0 &&
      this.email.length > 0 &&
      this.password.length >= 8 &&
      this.password === this.confirmPassword
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;
    this.loading.set(true);
    this.error.set('');
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al registrar. Intenta de nuevo.');
      },
    });
  }
}
