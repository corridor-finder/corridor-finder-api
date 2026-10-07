import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { APP_CONFIG_KEY } from './config/app-config.js';
import type { Env } from './config/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const env = app.get(ConfigService).getOrThrow<Env>(APP_CONFIG_KEY);
  await app.listen(env.PORT);
  new Logger('Bootstrap').log(`Listening on :${env.PORT} using ${env.DB_TYPE}`);
}

void bootstrap();
