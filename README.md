# Tech Radar 📡

> **Un radar de tecnologías donde equipos votan, descubren y visualizan tendencias tecnológicas en un gráfico de radar interactivo.**

Tech Radar permite a equipos de ingeniería registrar tecnologías, votar su nivel de adopción (1-5) y visualizar tendencias temporales en un gráfico de radar interactivo. Ideal para CTOs y tech leads que toman decisiones informadas sobre adopción de herramientas y frameworks.

---

## ✨ Features

- **Radar Chart interactivo**: Visualización SVG de tecnologías agrupadas por categoría con colores distintivos
- **Sistema de votación**: Usuarios votan tecnologías con puntuación 1-5 y comentarios opcionales
- **Timeline de tendencias**: Tecnologías en ascenso y declive con comparación por período
- **Filtros avanzados**: Filtrar por categoría, período de tiempo y score mínimo
- **Dashboard personal**: Resumen de votos, estadísticas y distribución por categoría
- **Autenticación JWT**: Registro, inicio de sesión y control de acceso por roles
- **Panel Admin**: CRUD completo de tecnologías y categorías
- **Modo oscuro**: Toggle de tema claro/oscuro
- **Modo responsivo**: Adaptado a dispositivos móviles y desktop

---

## 🛠 Stack

| Capa        | Tecnología                          |
|-------------|-------------------------------------|
| Frontend    | Angular 22 (standalone, signals, zoneless) |
| Backend     | NestJS (TypeORM, modular)           |
| Base de datos | SQLite (desarrollo) / PostgreSQL-ready |
| Estilos     | Tailwind CSS v3                     |
| Auth        | JWT con Passport.js + bcryptjs      |
| Documentación API | Swagger/OpenAPI                |
| Testing     | Jest (12 tests, 3 suites)           |

---

## 📁 Estructura del proyecto

```
tecnologia-radar/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   └── src/
│   │       ├── auth/           # Módulo de autenticación
│   │       ├── users/          # Módulo de usuarios
│   │       ├── categories/     # CRUD de categorías
│   │       ├── technologies/   # CRUD de tecnologías
│   │       ├── votes/          # Sistema de votación
│   │       ├── trends/         # Cálculo de tendencias
│   │       ├── radar/          # Datos agregados para el radar chart
│   │       ├── dashboard/      # Estadísticas de usuario
│   │       └── seed/           # Datos de demostración
│   └── web/                    # Frontend Angular
│       └── src/
│           ├── app/
│           │   ├── services/   # Servicios HTTP
│           │   ├── guards/     # Route guards (auth, admin)
│           │   ├── layout/     # Header, Footer
│           │   ├── shared/     # StarRating, Avatar
│           │   └── pages/      # 7 páginas lazy-loaded
│           └── styles.scss     # Tailwind + design system
├── docs/                       # Documentación
└── .gitignore
```

---

## 🚀 Local Setup

### Prerrequisitos

- Node.js >= 22
- npm >= 10

### 1. Clonar e instalar

```bash
git clone <repo-url> tecnologia-radar
cd tecnologia-radar

# Backend
cd apps/api
cp .env.example .env   # Configurar variables
npm install
npx ts-node src/main.ts &
# API en http://localhost:3000/api
# Swagger en http://localhost:3000/api/docs

# Frontend
cd ../web
npm install
npx ng serve &
# App en http://localhost:4200
```

### 2. Variables de entorno

```env
# apps/api/.env
DATABASE_PATH=./data/radar.db
JWT_SECRET=super-secret-key-change-in-production
```

### 3. Seed data

Al iniciar el backend, se crean automáticamente:

- **8 categorías**: Frontend, Backend, DevOps, Mobile, AI/ML, Tools, Database, Cloud
- **35 tecnologías**: React, Angular, NestJS, Docker, etc.
- **2 usuarios**: `admin@radar.dev` / `admin123` (admin) y `user@radar.dev` / `user123` (user)
- **~29 votos de ejemplo** distribuidos entre tecnologías

### 4. Credenciales de demo

| Rol  | Email              | Password |
|------|--------------------|----------|
| Admin | admin@radar.dev   | admin123 |
| User  | user@radar.dev    | user123  |

---

## 🧪 Tests

```bash
cd apps/api
npx jest --config jest.config.json
# 12 tests, 3 suites (auth, votes, trends)
```

---

## 🏗 Build

```bash
# Backend
cd apps/api && npx tsc

# Frontend
cd apps/web && npx ng build
```

---

## 🗺 Roadmap

- [ ] **Exportar radar como PNG** — Capturar el gráfico SVG como imagen
- [ ] **Comparativa de tecnologías** — Comparar dos tecnologías lado a lado
- [ ] **Roles avanzados** — Permisos granulares (editor, viewer)
- [ ] **Notificaciones** — Alertas cuando una tecnología cambia de score
- [ ] **Integración Neon/PostgreSQL** — Base de datos en producción
- [ ] **CI/CD pipeline** — GitHub Actions para build + test + lint
- [ ] **Despliegue** — Docker Compose + VPS o Railway

---

## 📄 Licencia

MIT
