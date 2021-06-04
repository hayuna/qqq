import supertest from 'supertest';
import app from '../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        
        describe('when each parameters are correct', () => {
            it('should return OK', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(200)
                expect(res.body).toMatchObject({
                    message: 'OK'
                });
            });    
        });

        describe('when there is no parameters', () => {
            it('should fail with invalid values', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "dataCenter is required",
                        "countryCode is required",
                        "language is required",
                        "system is required",
                        "userKey is required",
                        "secret is required"
                    ]
                });
            });
        });
        describe('when parameter is forbidden', () => {
            it('should fail with incorrect parameters', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        language: 'en',
                        countryCode: 'AU',
                        system: 'AEM',
                        userKey: 'testUserKey',
                        secret: 'test-secret',
                        incorrect: true,
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    incorrectParameters: [
                        "incorrect"
                    ]
                });
            });    
        });
    });
});
