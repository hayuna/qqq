import supertest from 'supertest';
import app from '../../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        describe('when secret does not exist', () => {
            it('should fail with invalid secret', async () => {
                await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
                        userKey: 'testUserKey'
                    })
                    .expect(response => {
                        expect(response.status).toBe(400)
                        expect(response.body).toMatchObject({
                            invalidValues: [
                                "secret is required"
                            ]
                        })
                    })
            });    
        });
    });
});
