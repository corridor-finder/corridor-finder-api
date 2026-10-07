import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_CONFIG_KEY, appConfig } from './config/app-config.js';
import type { Env } from './config/env.js';
import { buildDataSourceOptions, ensureSqliteDirectory } from './database/database.config.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const env = config.getOrThrow<Env>(APP_CONFIG_KEY);
        ensureSqliteDirectory(env);
        return buildDataSourceOptions(env);
      },
    }),
    HealthModule,
  ],
})
export class AppModule {}
