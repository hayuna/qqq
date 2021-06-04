import supertest from 'supertest';
import app from '../../src/app';

describe('createSite', () => {
    describe('POST /createSite', () => {
        describe('when purpose has more than 15 characters', () => {
            it('should fail with invalid purpose', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        language: 'en',
                        countryCode: 'AU',
                        system: 'australian-english',
                        userKey: 'testUserKey',
                        secret: 'test-secret',
                        system: 'AEM',
                        purpose: 'very-long-purpose-to-do-smart-things'
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "purpose length must be less than or equal to 15 characters long"
                    ]
                });
            });    
        });
    });
});
