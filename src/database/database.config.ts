import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { DataSourceOptions } from 'typeorm';
import type { Env } from '../config/env.js';

/**
 * Single place that maps validated env values to TypeORM options.
 * Migrations are the only way schema changes reach a database: `synchronize` is always off,
 * so SQLite and Postgres go through the same reviewed path.
 */
const here = dirname(fileURLToPath(import.meta.url));

export function buildDataSourceOptions(env: Env): DataSourceOptions {
  const shared = {
    entities: [join(here, '..', '**', '*.entity.{ts,js}')],
    migrations: [join(here, 'migrations', '*.{ts,js}')],
    synchronize: false,
  };

  if (env.DB_TYPE === 'sqlite') {
    return { type: 'better-sqlite3', database: env.SQLITE_PATH, ...shared };
  }

  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    ssl: env.DB_SSL,
    ...shared,
  };
}

/** better-sqlite3 will not create missing parent directories, so we do it for contributors. */
export function ensureSqliteDirectory(env: Env): void {
  if (env.DB_TYPE !== 'sqlite' || env.SQLITE_PATH === ':memory:') return;
  mkdirSync(dirname(env.SQLITE_PATH), { recursive: true });
}
