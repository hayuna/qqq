import supertest from 'supertest';
import app from '../../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        describe('when language does not exist', () => {
            it('should fail with invalid language', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        countryCode: 'AU',
                        system: 'AEM',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "language is required"
                    ]
                });
            });    
        });
        describe('when language has incorrect type', () => {
            it('should fail with invalid language', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        language: true,
                        countryCode: 'AU',
                        system: 'AEM',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "language must be one of [array, string]"
                    ]
                });
            });    
        });
        describe('when language has more than 5 characters', () => {
            it('should fail with invalid language', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        language: 'australian-english',
                        countryCode: 'AU',
                        system: 'AEM',
                        userKey: 'testUserKey',
                        secret: 'test-secret'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "language length must be less than or equal to 5 characters long"
                    ]
                });
            });    
        });
    });
});
