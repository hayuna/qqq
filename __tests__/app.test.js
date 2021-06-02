import app from '../src/app';
import supertest from 'supertest';

describe('app.ts file', () => {
  test('not found', async () => {
    await supertest(app).get('/not-found').expect(404);
  });
});
