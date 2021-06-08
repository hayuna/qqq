import supertest from 'supertest';
import app from '../../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        describe('when dataCenter has incorrect value', () => {
            it('should fail with invalid dataCenter', async () => {
                await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'DC',
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(response => {
                        expect(response.status).toBe(400)
                        expect(response.body).toMatchObject({
                            invalidValues: [
                                "dataCenter must be one of [EU, US, CN, RU]"
                            ]
                        });
        
                    })
            });    
        });
        describe('when dataCenter does not exist', () => {
            it('should fail with missing dataCenter', async () => {
                await supertest(app)
                    .post('/createSite')
                    .send({
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(response => {
                        expect(response.status).toBe(400)
                        expect(response.body).toMatchObject({
                            invalidValues: [
                                "dataCenter is required"
                            ]
                        })
                    })
            });
        });
    });
});
