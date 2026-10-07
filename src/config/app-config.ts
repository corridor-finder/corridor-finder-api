import { registerAs } from '@nestjs/config';
import { parseEnv } from './env.js';

export const APP_CONFIG_KEY = 'env';

/** Validated environment, available via ConfigService.getOrThrow<Env>(APP_CONFIG_KEY). */
export const appConfig = registerAs(APP_CONFIG_KEY, () => parseEnv(process.env));
