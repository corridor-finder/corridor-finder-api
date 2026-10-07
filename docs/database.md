# Database

The API runs on **SQLite or PostgreSQL**, chosen with `DB_TYPE` in `.env`. No Docker is needed.

| Goal                                | Set in `.env`                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| Fastest start (default)             | `DB_TYPE=sqlite` (optionally `SQLITE_PATH`)                                                 |
| Use your local PostgreSQL / pgAdmin | `DB_TYPE=postgres`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL` |

Create an empty database in pgAdmin first. The app never creates databases, only tables via migrations.

## Rules for contributors

1. **Migrations only.** `synchronize` is permanently off. Schema changes ship as files in `src/database/migrations/`.
2. **Write migrations with TypeORM's schema builder** (`queryRunner.createTable(new Table({...}))`, `addColumn`, `createIndex`, ...), **not raw SQL** and not auto-generated SQL. Generated migrations contain dialect-specific SQL and will break on the other database. CI runs both.
3. **Stay portable.** No Postgres-only types (`jsonb`, arrays, enums) or SQLite-only behavior. Store timestamps as ISO-8601 strings or `datetime`, money as strings/decimals handled in code, and structured data as JSON text.
4. Entities live next to their feature as `*.entity.ts` and are discovered automatically.

## Commands

```bash
pnpm migration:run      # apply pending migrations to the database selected in .env
pnpm migration:revert   # undo the last migration
```
