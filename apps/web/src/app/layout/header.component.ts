import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AvatarComponent } from '../shared/avatar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AvatarComponent],
  template: `
    <header class="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 text-xl font-bold text-primary-500">
            <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            Tech Radar
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <a routerLink="/" routerLinkActive="text-primary-500 font-medium" [routerLinkActiveOptions]="{exact: true}" class="px-3 py-2 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
              Radar
            </a>
            <a routerLink="/trends" routerLinkActive="text-primary-500 font-medium" class="px-3 py-2 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
              Tendencias
            </a>
            @if (auth.isAuthenticated()) {
              <a routerLink="/dashboard" routerLinkActive="text-primary-500 font-medium" class="px-3 py-2 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
                Dashboard
              </a>
            }
            @if (auth.isAdmin()) {
              <a routerLink="/admin" routerLinkActive="text-primary-500 font-medium" class="px-3 py-2 rounded-md text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors">
                Admin
              </a>
            }
          </nav>

          <!-- User Menu / Auth -->
          <div class="flex items-center gap-3">
            <!-- Dark mode toggle -->
            <button (click)="toggleDarkMode()" class="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" aria-label="Toggle dark mode">
              @if (isDark()) {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              }
            </button>

            @if (auth.isAuthenticated()) {
              <div class="relative">
                <button (click)="showMenu.set(!showMenu())" class="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                  <app-avatar [name]="auth.currentUser()?.name ?? ''" size="sm"/>
                </button>
                @if (showMenu()) {
                  <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800 py-1 z-50">
                    <div class="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
                      <p class="text-sm font-medium text-neutral-900 dark:text-neutral-100">{{ auth.currentUser()?.name }}</p>
                      <p class="text-xs text-neutral-500">{{ auth.currentUser()?.email }}</p>
                    </div>
                    <a routerLink="/dashboard" class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800" (click)="showMenu.set(false)">Dashboard</a>
                    <button (click)="auth.logout(); showMenu.set(false)" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      Cerrar sesión
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a routerLink="/login" class="btn-primary text-sm !px-4 !py-1.5">Iniciar sesión</a>
              <a routerLink="/register" class="btn-secondary text-sm !px-4 !py-1.5 hidden sm:inline-flex">Registrarse</a>
            }
          </div>
        </div>

        <!-- Mobile Navigation -->
        <nav class="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          <a routerLink="/" routerLinkActive="text-primary-500 font-medium" [routerLinkActiveOptions]="{exact: true}" class="px-3 py-1.5 rounded-md text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary-500 whitespace-nowrap transition-colors">
            Radar
          </a>
          <a routerLink="/trends" routerLinkActive="text-primary-500 font-medium" class="px-3 py-1.5 rounded-md text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary-500 whitespace-nowrap transition-colors">
            Tendencias
          </a>
          @if (auth.isAuthenticated()) {
            <a routerLink="/dashboard" routerLinkActive="text-primary-500 font-medium" class="px-3 py-1.5 rounded-md text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary-500 whitespace-nowrap transition-colors">
              Dashboard
            </a>
          }
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="text-primary-500 font-medium" class="px-3 py-1.5 rounded-md text-xs text-neutral-600 dark:text-neutral-400 hover:text-primary-500 whitespace-nowrap transition-colors">
              Admin
            </a>
          }
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected auth = inject(AuthService);
  protected showMenu = signal(false);
  protected isDark = signal(false);

  constructor() {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') {
      document.documentElement.classList.add('dark');
      this.isDark.set(true);
    }
  }

  toggleDarkMode(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('darkMode', String(next));
  }
}
