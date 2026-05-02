# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## GitHub Integration

- **GitHub account**: zuko-nova
- **Repository**: https://github.com/zuko-nova/workspace
- **Token**: Stored as `GITHUB_PERSONAL_ACCESS_TOKEN` secret
- **CI/CD**: GitHub Actions workflow at `.github/workflows/ci.yml` — runs typecheck and build on every push to `main`
- **Note**: GitHub integration uses the Personal Access Token (not Replit OAuth). To push code to GitHub, run the following in the Shell:
  ```bash
  bash push-to-github.sh
  ```
