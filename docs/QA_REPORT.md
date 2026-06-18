# QA Report — Tech Radar (tecnologia-radar)

## Resumen
✅ **PASS** — Builds exitosos, 44 tests pasando, cobertura mejorada

## Build
| Componente | Resultado |
|------------|-----------|
| `npx tsc` (API) | ✅ Sin errores |
| `ng build` (Web) | ✅ Sin errores — 282.95 kB main, lazy-loaded pages |

## Tests

### API (NestJS + Jest) — 5 suites, 32 tests, 0 fallos

| Suite | Tests | Estado |
|-------|-------|--------|
| `auth.service.spec.ts` | 5 | ✅ pass |
| `votes/vote.service.spec.ts` | 4 | ✅ pass |
| `trends/trend.service.spec.ts` | 3 | ✅ pass |
| `technologies/technology.service.spec.ts` | 16 | ✅ pass *(nuevo)* |
| `dashboard/dashboard.service.spec.ts` | 4 | ✅ pass *(nuevo)* |

### Web (Angular 22 + Vitest) — 3 suites, 12 tests, 0 fallos

| Suite | Tests | Estado |
|-------|-------|--------|
| `app.spec.ts` | 2 | ✅ pass *(fix: providers Router+HTTP)* |
| `services/auth.service.spec.ts` | 5 | ✅ pass *(nuevo)* |
| `services/radar.service.spec.ts` | 5 | ✅ pass *(nuevo)* |

**Total: 8 suites, 44 tests — todos pasando**

## Auditoría

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Build API | ✅ | tsc compila sin errores |
| Build Web | ✅ | ng build produce bundles óptimos con lazy loading |
| Tests | ✅ | 44 tests, 0 fallos, 0 skip |
| Lint | ⚠️ | No hay eslint config en api ni web |
| Types | ✅ | strictNullChecks en API, strict en Web |
| Código | ⚠️ | AdminPage (432 líneas) y RadarPage (295 líneas) grandes |
| Docs | ✅ | ARCHITECTURE, API, FRONTEND, DATABASE, DECISIONS, LEARNINGS completos |
| Edge cases | ✅ | Empty/loading/error states en componentes. Conflict/NotFound/Forbidden en API |
| Design System | ✅ | Tailwind config, colores, tipografía, sombras, radius coinciden con DESIGN_SYSTEM.md |
| Secretos | ⚠️ | JWT fallback hardcodeado en jwt.strategy.ts |
| Responsive | ✅ | Header adaptativo mobile/desktop, grid responsive |

## Issues

### [⚠️ Media] JWT secret hardcodeado como fallback
- **Archivo:** `apps/api/src/auth/jwt.strategy.ts:11`
- **Problema:** `secretOrKey: process.env.JWT_SECRET || 'tech-radar-secret-key-dev'` — en desarrollo está bien, pero si falta la env var en producción se usa un secreto conocido.
- **Solución:** Validar que JWT_SECRET exista al arrancar y fallar si no está definido.

### [⚠️ Media] Sin ESLint config en ningún proyecto
- **Problema:** No hay `eslint.config.js` en API ni Web. No se puede verificar calidad de código automáticamente.
- **Solución:** Generar configuración ESLint con `npx eslint --init` en cada proyecto.

### [⚠️ Media] Componentes demasiado grandes
- **AdminPage:** 432 líneas con lógica CRUD de tecnologías y categorías + modales → dividir en subcomponentes.
- **RadarPage:** 295 líneas con SVG inline y lógica de filtros → extraer SVG chart a componente separado.
- **DashboardPage:** 159 líneas → aceptable pero mejorable.

### [📝 Baja] Hardcoded API URL
- **Archivo:** `apps/web/src/app/services/api.service.ts:7`
- **Problema:** `baseUrl = 'http://localhost:3000/api'` hardcodeado.
- **Solución:** Usar environment variables de Angular (`src/environments/`) o proxy config.

### [📝 Baja] `In(techIds) as any` en TrendsService
- **Archivo:** `apps/api/src/trends/trend.service.ts:103`
- **Problema:** Type assertion `as any` en TypeORM `In()` — indica type mismatch.
- **Solución:** Tipar correctamente los IDs o actualizar tipos de TypeORM.

## Tests nuevos añadidos

### API
| Archivo | Tests | Propósito |
|---------|-------|-----------|
| `apps/api/src/technologies/technology.service.spec.ts` | 16 | CRUD completo + filtros + recalcScore |
| `apps/api/src/dashboard/dashboard.service.spec.ts` | 4 | Stats vacío, cálculo, decimales, sin categoría |

### Web
| Archivo | Tests | Propósito |
|---------|-------|-----------|
| `apps/web/src/app/services/auth.service.spec.ts` | 5 | Login, register, logout, getProfile con HTTP testing |
| `apps/web/src/app/services/radar.service.spec.ts` | 5 | getData con/sin parámetros de query |

### Fix
| Archivo | Detalle |
|---------|---------|
| `apps/web/src/app/app.spec.ts` | Añadidos provideRouter() y provideHttpClient() al TestBed. Cambiado test de título a verificación de estructura real (app-header, router-outlet, main). |
