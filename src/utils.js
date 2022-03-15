import { api } from "./api.js";
import FormData from 'form-data'
import config from "./config.js";

export const dataCenterConverter = (dataCenter) => {
    switch(dataCenter) {
        case 'EU': return 'eu1';
        case 'US': return 'us1';
        case 'RU': return 'ru1';
    }
}

export const dataCenterInURL = (dataCenter) => {
    switch(dataCenter) {
        case 'EU': return 'us1';
        case 'US': return 'us1';
        case 'RU': return 'ru1';
    }
}

export const Console = {
    log(e){
        console.log('\x1b[36m%s\x1b[0m', e);
    },
    error(e){
        console.log('\x1b[41m%s\x1b[0m', e);
    },
    warn(e){
        console.log('\x1b[36m%s\x1b[0m', `⚠️  ${e}`)
    }
}

export const getPartnerIdKey = () => {
    switch (body.dataCenter) {
        case 'US':
        case 'EU':
            return 'partnerId';
        case 'RU':
            return 'partnerIdRU'
    }
}

export const setCredentials = (data) => {
    if (body.dataCenter === 'RU') {
        data.append("secret", body.secretRU);
        data.append("userKey", body.userKeyRU);
    } else {
        data.append("secret", body.secret);
        data.append("userKey", body.userKey);
    }
    return data
}

export const isRU = () => {
    return body.dataCenter === 'RU'
}

export const getApikeyForProd = async (name = 'prod_eu_ch') => {
    const data = new FormData()
    data.append('targetPartnerID', config.PROD.partnerId)
    const sites = await api.admin(data, '/admin.console.getPagedUserEffectiveSites', false)
    return sites.sites.find(site => site.name === name).apiKey
}