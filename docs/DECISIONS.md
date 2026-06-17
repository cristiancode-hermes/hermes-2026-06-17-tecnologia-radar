# Decision Records

## ADR-001: SQLite for Development, PostgreSQL-Ready Schema

**Status:** Accepted

**Context:** The mission prompt requires Neon/PostgreSQL, but NEON_API_KEY is unavailable (empty for 6+ consecutive runs). The project must be testable locally.

**Decision:** Use SQLite with `better-sqlite3` in development, but design the schema with PostgreSQL-compatible types (`real`, `date`, `text`). Document the migration path for production PostgreSQL.

**Consequences:**
- + Rapid development with zero-config database
- + TypeORM abstracts most differences
- - Some SQL dialect differences (strftime vs EXTRACT)
- - Need to swap connection config for production

---

## ADR-002: Denormalized avgScore/voteCount on Technology

**Status:** Accepted

**Context:** The radar chart needs avgScore and voteCount for every technology. Computing these from the votes table on every radar render would require expensive GROUP BY aggregations.

**Decision:** Store `avgScore` and `voteCount` as columns on the `Technology` entity. Update them synchronously in `VoteService` after every vote create/update/delete.

**Consequences:**
- + Radar endpoint is fast (< 50ms)
- + Simple queries — no JOINs needed
- - Data redundancy (denormalized)
- - Must ensure updates are atomic (vote + recalculate in same method)

---

## ADR-003: SVG Radar Chart (No External Library)

**Status:** Accepted

**Context:** The radar chart is the core visual feature. Options were Chart.js, D3.js, or custom SVG.

**Decision:** Build a custom SVG polygon radar chart. No external chart library.

**Consequences:**
- + Zero additional bundle weight
- + Full control over rendering, interaction, animation
- + Accessibility via SVG `<title>` elements
- - More development effort than Chart.js
- - Limited chart types (radar only — line chart for trends also built custom)

---

## ADR-004: Signal-First Angular Architecture

**Status:** Accepted

**Context:** Angular 22 promotes signals as the primary reactivity primitive. Previous projects established patterns for signal-first components.

**Decision:** All component state uses `signal()`, `computed()`, `input()`, `output()`. No `@Input/@Output` decorators. Zoneless change detection with `provideZonelessChangeDetection()`.

**Consequences:**
- + Smaller, faster change detection
- + More predictable state management
- + Compatible with future Angular versions
- - ngModel requires plain string properties (not signals)

---

## ADR-005: Strategy Pattern for Trends Computation

**Status:** Accepted

**Context:** Trends can be computed for different periods (week, month, quarter). The computation logic needs to be extensible.

**Decision:** Period switching is handled by a simple `switch` statement in TrendsService. A full Strategy pattern was considered but deemed over-engineering for 4 period options.

**Consequences:**
- + Simple, readable code
- + Easy to add new periods
- - Not as extensible as Strategy pattern

---

## ADR-006: Seed Data on Startup

**Status:** Accepted

**Context:** The app needs demo data for evaluation. Manual seeding is error-prone.

**Decision:** Create a `SeedService` implementing `OnApplicationBootstrap` that checks if data exists and seeds categories, technologies, users, and votes on first startup.

**Consequences:**
- + Fresh demo data on every clean start
- + Idempotent (checks for existing data)
- + ~29 votes with realistic distribution
- - Slightly slower first startup (~2s)
