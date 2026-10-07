import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { parseEnv } from '../config/env.js';
import { buildDataSourceOptions, ensureSqliteDirectory } from './database.config.js';

/** Entry point for the TypeORM CLI (`pnpm migration:run`). Reads the same .env as the app. */
const env = parseEnv(process.env);
ensureSqliteDirectory(env);

export default new DataSource(buildDataSourceOptions(env));
