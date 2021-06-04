import supertest from 'supertest';
import app from '../../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        describe('when dataCenter has incorrect value', () => {
            it('should fail with invalid dataCenter', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'DC',
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "dataCenter must be one of [EU, US, CH, RU]"
                    ]
                });
            });    
        });
        describe('when dataCenter does not exist', () => {
            it('should fail with missing dataCenter', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "dataCenter is required"
                    ]
                });
            });    
        });
    });
});
