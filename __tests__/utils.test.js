import { dataCenterConverter, createDomainName } from '../src/utils'

describe('dataCenterConverter', () => {
    it('should return eu1', () => {
        expect(dataCenterConverter('EU')).toBe('eu1')
    })

    it('should return us1', () => {
        expect(dataCenterConverter('US')).toBe('us1')
    })

})

describe('createDomainName', () => {
    it('should return domain name base on request body', () => {
        const body = {
            dataCenter: 'EU',
            countryCode: 'AU'
        }
        expect(createDomainName('dev', body)).toBe('dev_eu_au')
    })

    it('should return domain name with purpose base on request body', () => {
        const body = {
            dataCenter: 'EU',
            countryCode: 'AU',
            purpose: '2FA'
        }
        expect(createDomainName('dev', body)).toBe('dev_eu_au_2fa')
    })
})