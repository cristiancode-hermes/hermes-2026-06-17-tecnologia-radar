# API Reference

Base URL: `http://localhost:3000/api`

## Authentication

### POST /api/auth/register

Register a new user.

```json
// Request
{ "email": "user@example.com", "password": "secure123", "name": "John Doe" }

// Response 201
{ "access_token": "jwt...", "user": { "id": 1, "email": "user@example.com", "name": "John Doe", "role": "user" } }
```

### POST /api/auth/login

Login with credentials.

```json
// Request
{ "email": "user@example.com", "password": "secure123" }

// Response 200
{ "access_token": "jwt...", "user": { "id": 1, "email": "user@example.com", "name": "John Doe", "role": "user" } }
```

### GET /api/auth/profile

Get current user profile. Requires JWT.

```json
// Response 200
{ "id": 1, "email": "user@example.com", "name": "John Doe", "role": "user", "createdAt": "2026-06-17T..." }
```

### PATCH /api/auth/profile

Update profile. Requires JWT.

```json
// Request
{ "name": "John Updated" }

// Response 200
{ "id": 1, "email": "user@example.com", "name": "John Updated", "role": "user" }
```

---

## Categories

### GET /api/categories

List all categories.

```json
// Response 200
[
  { "id": 1, "name": "Frontend", "description": "Frontend frameworks and libraries", "color": "#6366f1" },
  { "id": 2, "name": "Backend", "description": "Backend frameworks and runtimes", "color": "#22c55e" }
]
```

### GET /api/categories/:id

Get category detail with technologies.

```json
// Response 200
{
  "id": 1, "name": "Frontend", "color": "#6366f1",
  "technologies": [{ "id": 1, "name": "React", "avgScore": 4.5 }]
}
```

### POST /api/categories

Create category. Require Admin.

```json
// Request
{ "name": "Security", "description": "Security tools", "color": "#ef4444" }

// Response 201
{ "id": 9, "name": "Security", "description": "Security tools", "color": "#ef4444" }
```

### PATCH /api/categories/:id

Update category. Require Admin.

### DELETE /api/categories/:id

Delete category. Require Admin.

---

## Technologies

### GET /api/technologies

List technologies with optional filters.

**Query params:** `categoryId`, `period`, `minScore`, `sortBy` (score|votes|name|trend), `order` (asc|desc), `search`

```json
// Response 200
[
  {
    "id": 1, "name": "React", "description": "A JavaScript library for building UIs",
    "websiteUrl": "https://react.dev", "avgScore": 4.5, "voteCount": 15,
    "trend": 0.3, "categoryId": 1,
    "category": { "id": 1, "name": "Frontend", "color": "#6366f1" }
  }
]
```

### GET /api/technologies/:id

Get technology detail with category.

### POST /api/technologies

Create technology. Require Admin.

```json
// Request
{ "name": "Bun", "description": "Fast JavaScript runtime", "categoryId": 2, "websiteUrl": "https://bun.sh" }
```

### PATCH /api/technologies/:id

Update technology. Require Admin.

### DELETE /api/technologies/:id

Delete technology. Require Admin.

---

## Votes

### GET /api/technologies/:id/votes

List votes for a technology.

```json
// Response 200
[
  { "id": 1, "score": 5, "comment": "Excellent!", "userId": 1, "technologyId": 1, "createdAt": "2026-06-17T..." }
]
```

### POST /api/technologies/:id/votes

Vote for a technology (upsert). Requires JWT.

```json
// Request
{ "score": 4, "comment": "Great framework" }

// Response 201
{ "id": 1, "score": 4, "comment": "Great framework", "userId": 1, "technologyId": 1 }
```

### GET /api/votes/my

Get current user's votes. Requires JWT.

### PATCH /api/votes/:id

Update vote. Requires JWT (owner).

### DELETE /api/votes/:id

Delete vote. Requires JWT (owner).

---

## Trends

### GET /api/trends

Get technology trends for a period.

**Query params:** `period` (week|month|quarter|year, default: month), `limit` (default: 10)

```json
// Response 200
{
  "period": "month",
  "rising": [{ "technologyId": 1, "name": "React", "currentAvg": 4.5, "previousAvg": 4.2, "change": 0.3, "voteCount": 15 }],
  "declining": [{ "technologyId": 5, "name": "jQuery", "currentAvg": 2.1, "previousAvg": 2.6, "change": -0.5, "voteCount": 3 }],
  "stable": []
}
```

---

## Radar

### GET /api/radar

Get aggregated data for the radar chart.

```json
// Response 200
{
  "categories": [
    {
      "id": 1, "name": "Frontend", "color": "#6366f1",
      "technologies": [
        { "id": 1, "name": "React", "avgScore": 4.5, "voteCount": 15, "trend": 0.3 },
        { "id": 2, "name": "Angular", "avgScore": 4.2, "voteCount": 12, "trend": 0.5 }
      ]
    }
  ]
}
```

---

## Dashboard

### GET /api/dashboard/stats

Get current user's statistics. Requires JWT.

```json
// Response 200
{ "totalVotes": 5, "avgScore": 4.2, "categoriesVoted": 3, "lastVoteDate": "2026-06-17T..." }
```

### GET /api/dashboard/my-votes

Get current user's votes (paginated). Requires JWT.
**Query params:** `page` (default: 1), `limit` (default: 20)

---

## Swagger UI

Interactive API documentation available at: `/api/docs`
