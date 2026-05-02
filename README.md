# workspace

A pnpm monorepo built with TypeScript, Express, and PostgreSQL.

## Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | pnpm workspaces |
| Language | TypeScript 5.9 |
| Runtime | Node.js 24 |
| API | Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod (v4) |
| API codegen | Orval (OpenAPI → React Query + Zod) |
| Build | esbuild |

## Project Structure

```
workspace/
├── artifacts/
│   ├── api-server/        # Express API server
│   └── mockup-sandbox/    # UI component preview sandbox (Vite + React)
├── lib/
│   ├── api-spec/          # OpenAPI spec (source of truth)
│   ├── api-client-react/  # Generated React Query hooks
│   ├── api-zod/           # Generated Zod schemas
│   └── db/                # Drizzle ORM schema & migrations
└── scripts/               # Shared utility scripts
```

## Getting Started

### Prerequisites

- [Node.js 24+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- PostgreSQL database (set `DATABASE_URL` in environment)

### Installation

```bash
pnpm install
```

### Development

Run the API server:

```bash
pnpm --filter @workspace/api-server run dev
```

### Code Generation

Regenerate API hooks and Zod schemas from the OpenAPI spec:

```bash
pnpm --filter @workspace/api-spec run codegen
```

### Type Checking

```bash
pnpm run typecheck
```

### Build

```bash
pnpm --filter @workspace/api-server run build
```

### Database

Push schema changes to the database (development only):

```bash
pnpm --filter @workspace/db run push
```

## CI/CD

GitHub Actions runs on every push to `main`:
- Dependency install
- API codegen
- Full TypeScript typecheck
- API server build

## API

The API is defined in `lib/api-spec/openapi.yaml`. All client code (React Query hooks, Zod schemas) is generated from this file — edit the spec first, then run codegen.

### Health Check

```
GET /api/healthz
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port the API server listens on |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret used for session signing |
