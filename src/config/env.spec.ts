import { parseEnv } from './env.js';

describe('parseEnv', () => {
  it('defaults to sqlite with zero configuration', () => {
    const env = parseEnv({});
    expect(env).toMatchObject({
      DB_TYPE: 'sqlite',
      PORT: 3000,
      SQLITE_PATH: './data/corridor-finder.sqlite',
    });
  });

  it('accepts a complete postgres configuration and coerces types', () => {
    const env = parseEnv({
      DB_TYPE: 'postgres',
      DB_HOST: 'localhost',
      DB_PORT: '5433',
      DB_USERNAME: 'me',
      DB_PASSWORD: 'secret',
      DB_NAME: 'corridors',
      DB_SSL: 'true',
    });
    expect(env).toMatchObject({ DB_TYPE: 'postgres', DB_PORT: 5433, DB_SSL: true });
  });

  it('defaults the postgres port to 5432 and ssl to false', () => {
    const env = parseEnv({
      DB_TYPE: 'postgres',
      DB_HOST: 'localhost',
      DB_USERNAME: 'me',
      DB_PASSWORD: '',
      DB_NAME: 'corridors',
    });
    expect(env).toMatchObject({ DB_PORT: 5432, DB_SSL: false });
  });

  it('lists every missing postgres value in one readable error', () => {
    expect(() => parseEnv({ DB_TYPE: 'postgres' })).toThrow(
      /DB_HOST is required when DB_TYPE=postgres/,
    );
    expect(() => parseEnv({ DB_TYPE: 'postgres' })).toThrow(
      /DB_NAME is required when DB_TYPE=postgres/,
    );
  });

  it('rejects unknown database types', () => {
    expect(() => parseEnv({ DB_TYPE: 'mysql' })).toThrow(/Invalid environment configuration/);
  });

  it('treats empty strings as unset', () => {
    expect(parseEnv({ DB_TYPE: '', PORT: '' })).toMatchObject({ DB_TYPE: 'sqlite', PORT: 3000 });
  });

  it('rejects an out-of-range port', () => {
    expect(() => parseEnv({ PORT: '70000' })).toThrow(/PORT/);
  });
});
