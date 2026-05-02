# Contributing

Thank you for your interest in contributing! This guide covers how to get set up locally, the development workflow, and how to submit changes.

## Prerequisites

- [Node.js 24+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) — install with `npm install -g pnpm`
- PostgreSQL database

## Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/zuko-nova/workspace.git
   cd workspace
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set environment variables**

   Create a `.env` file in the root (never commit this):

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/mydb
   SESSION_SECRET=your-secret-here
   PORT=8080
   ```

4. **Generate API code**

   ```bash
   pnpm --filter @workspace/api-spec run codegen
   ```

5. **Push database schema**

   ```bash
   pnpm --filter @workspace/db run push
   ```

6. **Start the API server**

   ```bash
   pnpm --filter @workspace/api-server run dev
   ```

## Development Workflow

### Project structure

```
artifacts/   — deployable apps (API server, UI sandbox)
lib/         — shared libraries (DB schema, API spec, generated clients)
scripts/     — utility scripts
```

### Making changes

- **API changes** — edit `lib/api-spec/openapi.yaml` first, then run codegen:
  ```bash
  pnpm --filter @workspace/api-spec run codegen
  ```
- **Database changes** — update `lib/db/src/schema/index.ts`, then push:
  ```bash
  pnpm --filter @workspace/db run push
  ```
- **Server changes** — edit files in `artifacts/api-server/src/`

### Type checking

Always run the full typecheck before submitting:

```bash
pnpm run typecheck
```

### Building

```bash
pnpm --filter @workspace/api-server run build
```

## Submitting a Pull Request

1. Fork the repository and create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure the typecheck passes:
   ```bash
   pnpm run typecheck
   ```

3. Commit with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```

4. Push your branch and open a Pull Request against `main`

5. GitHub Actions will automatically run the CI checks on your PR

## Commit Message Format

Use clear, descriptive prefixes:

| Prefix | When to use |
|--------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Maintenance, dependency updates |
| `docs:` | Documentation changes |
| `refactor:` | Code restructuring without behavior change |

## Questions

Open an issue on GitHub if you have any questions or run into problems.
