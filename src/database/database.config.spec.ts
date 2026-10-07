import { mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseEnv } from '../config/env.js';
import { buildDataSourceOptions, ensureSqliteDirectory } from './database.config.js';

describe('buildDataSourceOptions', () => {
  it('maps sqlite env to better-sqlite3 options', () => {
    const opts = buildDataSourceOptions(parseEnv({ SQLITE_PATH: './data/x.sqlite' }));
    expect(opts).toMatchObject({
      type: 'better-sqlite3',
      database: './data/x.sqlite',
      synchronize: false,
    });
  });

  it('maps postgres env to postgres options', () => {
    const opts = buildDataSourceOptions(
      parseEnv({
        DB_TYPE: 'postgres',
        DB_HOST: 'h',
        DB_USERNAME: 'u',
        DB_PASSWORD: 'p',
        DB_NAME: 'n',
      }),
    );
    expect(opts).toMatchObject({
      type: 'postgres',
      host: 'h',
      port: 5432,
      username: 'u',
      password: 'p',
      database: 'n',
      ssl: false,
      synchronize: false,
    });
  });

  it('never enables synchronize', () => {
    expect(buildDataSourceOptions(parseEnv({}))).toHaveProperty('synchronize', false);
  });
});

describe('ensureSqliteDirectory', () => {
  it('creates missing parent directories for the sqlite file', () => {
    const dir = join(mkdtempSync(join(tmpdir(), 'cf-')), 'nested', 'deeper');
    ensureSqliteDirectory(parseEnv({ SQLITE_PATH: join(dir, 'db.sqlite') }));
    expect(existsSync(dir)).toBe(true);
  });

  it('does nothing for in-memory databases', () => {
    expect(() => ensureSqliteDirectory(parseEnv({ SQLITE_PATH: ':memory:' }))).not.toThrow();
  });
});
