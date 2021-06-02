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
                        "system is required"
                    ]
                });
            });
        });

        describe('when dataCenter has incorrect value', () => {
            it('should fail with invalid dataCenter', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'DC',
                        countryCode: 'AU',
                        language: 'en',
                        system: 'AEM',
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
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "dataCenter is required"
                    ]
                });
            });    
        });

        describe('when countryCode does not exist', () => {
            it('should fail with invalid countryCode', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        language: 'en',
                        system: 'AEM',
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "countryCode is required"
                    ]
                });
            });    
        });
        describe('when countryCode has more than 10 characters', () => {
            it('should fail with invalid countryCode', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        countryCode: 'United States of America',
                        language: 'en',
                        system: 'AEM',
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "countryCode length must be less than or equal to 10 characters long"
                    ]
                });
            });    
        });

        describe('when language does not exist', () => {
            it('should fail with invalid language', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        countryCode: 'AU',
                        system: 'AEM',
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
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "language length must be less than or equal to 5 characters long"
                    ]
                });
            });    
        });

        describe('when system does not exist', () => {
            it('should fail with invalid system', async () => {
                const res = await supertest(app)
                    .post('/createSite')
                    .send({
                        dataCenter: 'US',
                        language: 'en',
                        countryCode: 'AU'
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
                    })
                    .expect(400)
                expect(res.body).toMatchObject({
                    invalidValues: [
                        "system length must be less than or equal to 10 characters long"
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
