# corridor-finder-api

Backend for **Corridor Finder**: which Stellar anchors, assets and payment rails connect one country to another, with the source and age of every fact.

> Status: foundation only. Health check, configuration and database wiring exist; corridor features are being built as tracked issues.

**Hard rule:** the API never invents data. Fees, limits, speed, routes and availability are returned only when a source supports them, together with that source and a timestamp. Unknown means `unavailable`, never an estimate.

## Repositories

| Repo                                                                                      | Role                                            |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [`corridor-finder`](https://github.com/corridor-finder/corridor-finder)                   | Project hub: architecture, roadmap, ADRs        |
| [`corridor-finder-registry`](https://github.com/corridor-finder/corridor-finder-registry) | Curated, sourced corridor data and schema       |
| **[`corridor-finder-api`](https://github.com/corridor-finder/corridor-finder-api)**       | This repo: verification and corridor resolution |
| [`corridor-finder-web`](https://github.com/corridor-finder/corridor-finder-web)           | Next.js front end                               |

## Quick start

Requirements: Node 22 (`nvm use`) and pnpm (`corepack enable`). No Docker.

```bash
pnpm install
pnpm start:dev          # http://localhost:3000/health
```

With no `.env`, the API uses a SQLite file at `./data/corridor-finder.sqlite`.

### Use your local PostgreSQL (pgAdmin)

1. In pgAdmin, create an empty database, for example `corridor_finder`.
2. `cp .env.example .env`, then set `DB_TYPE=postgres` and fill in `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`.
3. `pnpm start:dev`. A wrong or missing value stops startup with a message naming the variable.

Details and migration rules: [docs/database.md](docs/database.md).

## Environment variables

| Variable                            | Default                         | Needed when                   |
| ----------------------------------- | ------------------------------- | ----------------------------- |
| `NODE_ENV`                          | `development`                   |                               |
| `PORT`                              | `3000`                          |                               |
| `DB_TYPE`                           | `sqlite`                        | `sqlite` or `postgres`        |
| `SQLITE_PATH`                       | `./data/corridor-finder.sqlite` | `DB_TYPE=sqlite`              |
| `DB_HOST`, `DB_USERNAME`, `DB_NAME` | none                            | `DB_TYPE=postgres` (required) |
| `DB_PORT`                           | `5432`                          | `DB_TYPE=postgres`            |
| `DB_PASSWORD`                       | empty                           | `DB_TYPE=postgres`            |
| `DB_SSL`                            | `false`                         | `DB_TYPE=postgres`            |

## Scripts

| Command                     | What it does                                                        |
| --------------------------- | ------------------------------------------------------------------- |
| `pnpm check`                | Everything CI runs: lint, typecheck, format check, test, build      |
| `pnpm test`                 | Vitest. Uses in-memory SQLite unless `DB_TYPE` is set in your shell |
| `pnpm lint` / `pnpm format` | ESLint / Prettier                                                   |
| `pnpm build`                | Compile to `dist/`                                                  |

### Testing against PostgreSQL

```bash
DB_TYPE=postgres DB_HOST=localhost DB_USERNAME=postgres DB_PASSWORD=... DB_NAME=corridor_finder pnpm test
```

CI runs the suite on both databases. Use a throwaway database: tests only run `SELECT 1` today, but future tests will write.

## Stack

NestJS 12 (ESM) · TypeORM · SQLite (better-sqlite3) / PostgreSQL · Vitest · ESLint + Prettier · pnpm. TypeScript is pinned to 6.x until typescript-eslint supports 7.x.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Licensed under [Apache-2.0](LICENSE).
