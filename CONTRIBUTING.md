# Contributing to corridor-finder-api

Thanks for helping. Issue templates, the code of conduct and the security policy are shared across the organization (see the `.github` repository).

## Workflow

1. Pick an open issue and comment to be assigned. Do not start work on an unassigned issue; someone else may hold it.
2. Fork, branch from `main` (`feat/<short-name>`), and keep the PR to the scope in the issue.
3. Run `pnpm check` before pushing. It runs exactly what CI runs.
4. Open a PR that links the issue (`Closes #123`). Fill in the PR template.

## Standards

- **No fabricated data.** If a value has no source, return it as unavailable. Every returned fact carries its source and a timestamp.
- **Tests required** for new behavior, plus docs when behavior or configuration changes.
- **Databases:** follow [docs/database.md](docs/database.md). Migrations must run on both SQLite and PostgreSQL.
- **Config:** new environment variables go in `src/config/env.ts` (validated), `.env.example` and the README table.
- Do not commit secrets or `.env`.

## Known tooling constraint

Keep TypeScript on 6.x. Upgrading to 7.x breaks ESLint and the test tooling for now.
