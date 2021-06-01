import supertest from 'supertest';
import app from '../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        it('should return OK', async () => {
            const res = await supertest(app)
                .post('/createSite')
                .expect(200)
            expect(res.body).toMatchObject({
                message: 'OK'
            });
        });
    });
});
