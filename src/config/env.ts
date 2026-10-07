import { z } from 'zod';

const required = (name: string, reason: string) =>
  z.string({ error: `${name} is required ${reason}` }).min(1, `${name} must not be empty`);

const common = {
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
};

const sqliteEnv = z.object({
  ...common,
  DB_TYPE: z.literal('sqlite'),
  SQLITE_PATH: z.string().min(1).default('./data/corridor-finder.sqlite'),
});

const postgresEnv = z.object({
  ...common,
  DB_TYPE: z.literal('postgres'),
  DB_HOST: required('DB_HOST', 'when DB_TYPE=postgres'),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
  DB_USERNAME: required('DB_USERNAME', 'when DB_TYPE=postgres'),
  // May be empty (e.g. local trust auth), so it defaults to '' instead of being required.
  DB_PASSWORD: z.string().default(''),
  DB_NAME: required('DB_NAME', 'when DB_TYPE=postgres'),
  DB_SSL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
});

export const envSchema = z.discriminatedUnion('DB_TYPE', [sqliteEnv, postgresEnv]);

export type Env = z.infer<typeof envSchema>;
export type PostgresEnv = Extract<Env, { DB_TYPE: 'postgres' }>;
export type SqliteEnv = Extract<Env, { DB_TYPE: 'sqlite' }>;

/**
 * Validates raw environment variables (usually process.env).
 * - DB_TYPE defaults to "sqlite" so a fresh clone runs with zero setup.
 * - Empty strings are treated as "not set" so `DB_PORT=` in a .env behaves like a missing value.
 * Throws an Error with one readable line per problem.
 */
export function parseEnv(raw: Record<string, string | undefined>): Env {
  const cleaned: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value !== undefined && value !== '') cleaned[key] = value;
  }
  const result = envSchema.safeParse({ DB_TYPE: 'sqlite', ...cleaned });
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  - ${i.path.join('.') || 'env'}: ${i.message}`);
    throw new Error(`Invalid environment configuration. See .env.example.\n${lines.join('\n')}`);
  }
  return result.data;
}
