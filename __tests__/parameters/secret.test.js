import supertest from 'supertest';
import app from '../../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        describe('when secret does not exist', () => {
            it('should fail with invalid secret', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
                        userKey: 'testUserKey'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "secret is required"
                    ]
                });
            });    
        });
    });
});
