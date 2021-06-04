import supertest from 'supertest';
import app from '../../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        describe('when userKey does not exist', () => {
            it('should fail with invalid userKey', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
                        secret: 'test-secret'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "userKey is required"
                    ]
                });
            });    
        });
    });
});
