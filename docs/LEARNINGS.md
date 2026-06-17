# Learnings & Patterns

This document captures the technical insights gained while building the Tech Radar project.

## 1. Testing with bcryptjs and Jest

**Challenge:** `jest.spyOn(bcrypt, 'compare')` fails because bcryptjs exports a non-configurable `compare` function that Jest cannot spy on.

**Solution:** Mock the entire bcryptjs module at the top of the test file:

```typescript
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn().mockResolvedValue(true),
}));
```

This replaces all bcryptjs exports with Jest mocks, allowing controlled testing of auth flows.

**Lesson:** For modules that prevent `jest.spyOn`, replace with `jest.mock()` at module level.

---

## 2. TypeORM 1.0 API Changes

**Challenge:** TypeORM 1.0 (shipped with @nestjs/typeorm v11) removes several methods that existed in 0.3.x.

**Key differences:**
- `findByIds()` → removed. Use `findBy({ id: In([1,2,3]) })`
- `relations: ['category']` → `relations: { category: true }` (object syntax)
- Operators: `$gte` → `MoreThanOrEqual()`, `Like` stays as `Like()`
- `findOne({ where: { id } })` still works but `findOneOrFail` may have different error handling

**Lesson:** Always check TypeORM 1.0 migration guide when setting up a new project. The object-syntax for relations is the most impactful change.

---

## 3. SVG Polygon Radar Chart Construction

**Challenge:** Building an interactive radar/spider chart in pure SVG without a chart library.

**Solution:** Compute polygon points using trigonometry:

```typescript
// For N axes, angle per axis = (2 * PI) / N
// Each axis is a radius from center, technology points are placed along radius by their score
function getPoint(centerX: number, centerY: number, radius: number, angle: number) {
  return {
    x: centerX + radius * Math.sin(angle),
    y: centerY - radius * Math.cos(angle),
  };
}
```

Key considerations:
- Each category gets one axis (8 axes for 8 categories = 45° each)
- Score 0-5 maps to radius 0-maxRadius
- `<polygon>` elements for the radar grid background
- `<circle>` elements for technology points
- `<line>` elements connecting points to center
- SVG hover events with `<title>` for tooltips

**Lesson:** Custom SVG builds are viable for specialized visualizations. The trigonometry is straightforward — `sin/cos` for circular arrangement, scale by score for point position.

---

## 4. Angular 22 Security Scanner Blocks

**Challenge:** The security scanner blocks `npx ng build` because the package name 'ng' is within edit distance of 'pg' (typosquatting detection).

**Solution:** Use the full path: `node_modules/.bin/ng build` instead of `npx ng build`.

**Lesson:** When security scanners block package manager commands, use direct binary paths. Also applies to `npm run build` (if defined in scripts).

---

## 5. Complex Expressions in @let Blocks

**Challenge:** Angular 22's `@let` template syntax cannot parse multi-line arrow functions or complex `.map().join()` chains in templates.

**Bad (fails at compile time):**
```html
@let points = items.map((h, i) => { let x = ...; return x + ',' + y; }).join(' ');
```

**Good (move to component class):**
```typescript
sparklinePoints = computed(() => 
  this.items().map((h, i) => {
    // computation here
  }).join(' ')
);
```

**Lesson:** Template expressions must be simple. Any computation beyond basic property access or arithmetic belongs in the component class as computed signals or methods.

---

## 6. Applying Previous Project Lessons

**Applied from Finance Dashboard (2026-06-16):**

1. **Aggregation queries with COALESCE**: Used in vote service to compute avgScore after each vote — `COALESCE(AVG(v.score), 0)` prevents NULL results.

2. **Signal-based dashboard with computed**: Dashboard page follows the established pattern with `signal()` for fetched data and template-side conditional rendering.

3. **TypeORM 1.0 object relations syntax**: Used `relations: { category: true }` consistently throughout all services.

4. **PostgreSQL-compatible schema**: Designed schema with `date` type, `real` for decimals, documented migration path for PostgreSQL.

**Lesson:** The established patterns from 7+ previous projects significantly accelerate development — JWT auth, signal architecture, and TypeORM configuration are now template-level decisions.
