import supertest from 'supertest';
import app from '../../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        describe('when userKey does not exist', () => {
            it('should fail with invalid userKey', async () => {
                await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
                        secret: 'test-secret'
                    })
                    .expect(response => {
                        expect(response.status).toBe(400)
                        expect(response.body).toMatchObject({
                            invalidValues: [
                                "userKey is required"
                            ]
                        })
                    })
            });    
        });
    });
});
