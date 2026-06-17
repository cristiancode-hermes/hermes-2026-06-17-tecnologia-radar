# Frontend Architecture

## Signal Architecture

Tech Radar uses a **signal-first** architecture with Angular 22's zoneless change detection.

### State Management Pattern

All component state follows this pattern:

```typescript
// Data fetching state
data = signal<T | null>(null);
loading = signal(true);
error = signal<string | null>(null);

// Derived values (memoized)
isEmpty = computed(() => !this.loading() && this.data()?.length === 0);
```

Template:

```html
@if (loading()) {
  <spinner />
} @else if (error()) {
  <error-state [msg]="error()" (retry)="load()" />
} @else if (isEmpty()) {
  <empty-state />
} @else {
  <!-- content -->
}
```

### Component Communication

- **Parent → Child**: `input<T>()` signals (never `@Input()`)
- **Child → Parent**: `output<T>()` emitters (never `@Output()`)
- **Cross-component**: Shared services with signal state (AuthService)

### Key Signal Usage by Page

| Page       | Signals                                      | Computed Values |
|------------|----------------------------------------------|-----------------|
| Radar      | technologies, categories, filters, loading, error | filteredTechs by category/score |
| Technology Detail | technology, userVote, votes, loading | userHasVoted, avgScore |
| Trends     | data, loading, error                        | risingTechs, decliningTechs |
| Dashboard  | stats, myVotes, loading                     | categoryDistribution |
| Admin      | technologies, categories, activeTab, loading | — |

### Why Not RxJS for State?

- Signals are simpler for component-local state
- `computed()` provides memoization without subscriptions
- RxJS is still used at the async boundary (HttpClient → service), bridged with manual `subscribe()` calls
- For future optimization, `toSignal()` could convert observables to signals

### Zoneless Notes

- `provideZonelessChangeDetection()` in app.config.ts
- No NgZone usage anywhere
- Change detection triggered by:
  - Signal value changes (automatic)
  - Async pipe updates (via internal scheduling)
  - DOM events (automatic in zoneless mode)

### Lazy Loading

Each page is a standalone component loaded via `loadComponent`:

```typescript
{ path: '', loadComponent: () => import('./pages/radar/radar-page.component').then(m => m.RadarPage) }
```

Build output shows 11 lazy chunks, each page under 16KB (radar page: 11KB, admin: 16KB).

### Design System Integration

Tailwind CSS with custom theme:

```javascript
colors: {
  primary: { 50: '#eef2ff', 500: '#6366f1', ... },
  secondary: { 500: '#22c55e' },
  accent: { 500: '#f97316' },
}
```

Components use reusable CSS classes:
- `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-ghost`
- `.input`, `.card`, `.badge`
- Colors for category badges match radar chart categories

### Dark Mode

- Toggle via header button
- Stored in localStorage
- Applied as `dark` class on `<html>` element
- Tailwind `darkMode: 'class'` strategy
- All components styled with `dark:` variants
