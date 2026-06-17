import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login-page.component').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register-page.component').then(m => m.RegisterPage) },
  { path: '', loadComponent: () => import('./pages/radar/radar-page.component').then(m => m.RadarPage) },
  { path: 'technology/:id', loadComponent: () => import('./pages/technology-detail/technology-detail-page.component').then(m => m.TechnologyDetailPage) },
  { path: 'trends', loadComponent: () => import('./pages/trends/trends-page.component').then(m => m.TrendsPage) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard-page.component').then(m => m.DashboardPage), canActivate: [authGuard] },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin-page.component').then(m => m.AdminPage), canActivate: [adminGuard] },
  { path: '**', redirectTo: '' },
];
