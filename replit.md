# Nova Market

## Overview

Nova Market is a full-stack digital content marketplace for courses, templates, and creative resources. Built as a pnpm monorepo with a React/Vite frontend and Express API backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + Vite, Tailwind CSS, shadcn/ui, wouter routing, TanStack Query
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM (`lib/db`)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- **Build**: esbuild (server), Vite (client)

## Artifact Structure

- `artifacts/nova-market` — React/Vite frontend (previewPath: `/`)
- `artifacts/api-server` — Express API server (previewPath: `/api`)
- `lib/api-spec` — OpenAPI spec + codegen (generates Zod schemas + React Query hooks)
- `lib/api-zod` — Generated Zod schemas (`@workspace/api-zod`)
- `lib/api-client-react` — Generated React Query hooks (`@workspace/api-client-react`)
- `lib/db` — Drizzle ORM schema + client (`@workspace/db`)

## Database Schema

Tables: `users`, `categories`, `products`, `orders`, `reviews`

Seeded with: 3 users (Zuko Nova as creator), 6 categories, 6 products, 3 orders, 5 reviews.

## API Routes

All routes under `/api`:
- `GET/POST /products` — list (filter/search/sort/paginate) and create products
- `GET /products/featured` — featured products
- `GET/PUT/DELETE /products/:id` — single product CRUD
- `GET/POST /products/:id/reviews` — product reviews
- `GET /categories` — list categories with product counts
- `GET/POST /orders` — buyer orders
- `GET /dashboard/stats` — creator analytics (revenue, sales, top products, recent orders)
- `GET /dashboard/products` — creator's product list
- `GET /users/me` — current user profile

## Frontend Pages

- `/` — Home (hero, featured products, categories)
- `/marketplace` — Browse with search, filter by category, sort
- `/products/:id` — Product detail with reviews
- `/orders` — Purchase history
- `/dashboard` — Creator analytics dashboard
- `/dashboard/products/new` — Create a new product
- `/profile` — User profile

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## GitHub Integration

- **GitHub account**: zuko-nova
- **Repository**: https://github.com/zuko-nova/nova-market
- **Token**: Stored as `GITHUB_PERSONAL_ACCESS_TOKEN` secret
- **CI/CD**: GitHub Actions workflow at `.github/workflows/ci.yml`
- **Note**: To push code to GitHub, run the following in the Shell:
  ```bash
  bash push-to-github.sh
  ```
