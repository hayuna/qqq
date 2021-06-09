import { dataCenterConverter, createDomainName, dataCenterInURL, replaceVariablesInWebSDK } from '../src/utils'

describe('dataCenterConverter', () => {
    it('should return eu1', () => {
        expect(dataCenterConverter('EU')).toBe('eu1')
    })

    it('should return us1', () => {
        expect(dataCenterConverter('US')).toBe('us1')
    })

})

describe('dataCenterInURL', () => {
    it('should return us1', () => {
        expect(dataCenterInURL('EU')).toBe('us1')
    })

    it('should return us1', () => {
        expect(dataCenterInURL('US')).toBe('us1')
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

describe('replaceVariablesInWebSDK', () => {
    it('should return variable replacement', () => {
        const body = {
            countryCode: 'AU'
        }
        const webSDK = 'gigya.thisScript.globalConf.countryCode = [[COUNTRY_CODE]];';
        expect(replaceVariablesInWebSDK(webSDK, body)).toBe(`gigya.thisScript.globalConf.countryCode = 'AU';`)
    })
})