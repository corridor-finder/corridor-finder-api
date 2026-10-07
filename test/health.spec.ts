import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

// Runs against whatever database the environment selects. With nothing set it uses an
// in-memory SQLite database; CI also runs it with DB_TYPE=postgres.
process.env.DB_TYPE ??= 'sqlite';
if (process.env.DB_TYPE === 'sqlite') process.env.SQLITE_PATH ??= ':memory:';

import { AppModule } from '../src/app.module.js';

describe('GET /health', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('reports the database as up', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body).toEqual({
      status: 'ok',
      database: {
        type: process.env.DB_TYPE === 'postgres' ? 'postgres' : 'better-sqlite3',
        status: 'up',
      },
    });
  });
});
