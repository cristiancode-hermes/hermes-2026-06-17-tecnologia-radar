# Database Schema

## Entities

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Vote : has
    Technology ||--o{ Vote : receives
    Category ||--o{ Technology : groups

    User {
        int id PK
        string email UK
        string password
        string name
        string role "user | admin"
        date createdAt
        date updatedAt
    }

    Category {
        int id PK
        string name UK
        string description
        string color "hex color for radar"
        date createdAt
        date updatedAt
    }

    Technology {
        int id PK
        string name UK
        text description
        string websiteUrl
        string logoUrl
        real avgScore "0-5, denormalized"
        int voteCount "denormalized"
        real trend "score change in period"
        int categoryId FK
        date createdAt
        date updatedAt
    }

    Vote {
        int id PK
        int userId FK UK
        int technologyId FK UK
        int score "1-5"
        text comment
        date createdAt
        date updatedAt
    }
```

### Key Design Decisions

1. **Denormalized avgScore & voteCount**: Stored on Technology entity to avoid expensive JOINs on every radar render. Updated in VoteService after each create/update/delete.

2. **Composite UNIQUE (userId, technologyId)**: Enforces one vote per user per technology. Upsert pattern: `save()` creates or updates.

3. **trend field**: Computed field stored on Technology. Updated periodically or on demand via TrendsService. Represents score change in the configured period.

4. **PostgreSQL-compatible types**: 
   - `real` for decimal values (maps to `double precision` in PG)
   - `date` for date-only fields
   - `text` for variable-length strings

### Indexes

| Entity     | Index                  | Type   | Columns          |
|------------|------------------------|--------|------------------|
| User       | idx_users_email        | UNIQUE | email            |
| Category   | idx_categories_name    | UNIQUE | name             |
| Technology | idx_technologies_name  | UNIQUE | name             |
| Technology | idx_technologies_category | INDEX | categoryId     |
| Technology | idx_technologies_score | INDEX  | avgScore DESC    |
| Technology | idx_technologies_trend | INDEX  | trend DESC       |
| Vote       | idx_votes_user_tech    | UNIQUE | userId, technologyId |
| Vote       | idx_votes_user         | INDEX  | userId           |
| Vote       | idx_votes_technology   | INDEX  | technologyId     |
| Vote       | idx_votes_created      | INDEX  | createdAt        |

## Key Queries

### Recalculate score after vote
```sql
UPDATE technologies t
SET avgScore = (
  SELECT COALESCE(AVG(v.score), 0)
  FROM votes v WHERE v.technologyId = t.id
),
voteCount = (
  SELECT COUNT(*) FROM votes v WHERE v.technologyId = t.id
)
WHERE t.id = :technologyId;
```

### Trend calculation for a period
```sql
-- Compare current period vs previous period averages
WITH current AS (
  SELECT AVG(score) as avg FROM votes
  WHERE technologyId = :techId
  AND createdAt >= :currentStart
),
previous AS (
  SELECT AVG(score) as avg FROM votes
  WHERE technologyId = :techId
  AND createdAt >= :previousStart
  AND createdAt < :currentStart
)
SELECT COALESCE(current.avg, 0) - COALESCE(previous.avg, 0) AS trend;
```

### Radar data
```sql
SELECT c.id as categoryId, c.name as categoryName, c.color as categoryColor,
       t.id as techId, t.name as techName, t.avgScore, t.voteCount, t.trend
FROM categories c
LEFT JOIN technologies t ON t.categoryId = c.id
ORDER BY c.name, t.avgScore DESC;
```

## Migration Strategy

**Development**: TypeORM `synchronize: true` auto-creates tables from entity definitions.

**Production (PostgreSQL/Neon)**: 
1. Set `synchronize: false`
2. Generate migration: `npx typeorm migration:generate -d src/migrations/Init`
3. Run migration: `npx typeorm migration:run`
4. Update connection config: `type: 'postgres'`, URL from Neon dashboard

### PostgreSQL Changes Required
| SQLite                | PostgreSQL                | Locations                    |
|-----------------------|---------------------------|------------------------------|
| `strftime('%m', t.date)` | `EXTRACT(MONTH FROM t.date)` | trend.service.ts, dashboard.service.ts |
| `better-sqlite3` as any | `postgres`               | app.module.ts                |
