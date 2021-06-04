import supertest from 'supertest';
import app from '../../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        describe('when system does not exist', () => {
            it('should fail with invalid system', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        language: 'en',
                        countryCode: 'AU',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "system is required"
                    ]
                });
            });    
        });
        describe('when system has more than 10 characters', () => {
            it('should fail with invalid system', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        language: 'en',
                        countryCode: 'AU',
                        system: 'australian-english',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "system length must be less than or equal to 10 characters long"
                    ]
                });
            });    
        });
    });
});
