export const dataCenterConverter = (dataCenter) => {
    switch(dataCenter) {
        case 'EU': return 'eu1';
        case 'US': return 'us1';
    }
}

export const dataCenterInURL = (dataCenter) => {
    switch(dataCenter) {
        case 'EU': return 'us1';
        case 'US': return 'us1';
    }
}

export const createDomainName = (environment, body) => {
    console.log('1/10 Generating domain name')
    const purpose = body.purpose
    console.log('2/10 Domain name was generated')
    return `${environment}_${body.dataCenter}_${body.countryCode}${purpose ? '_'+purpose : ''}`.toLowerCase();
};

export const replaceVariablesInWebSDK = (webSDK, body) => {
    const variables = {
      'COUNTRY_CODE': body.countryCode,
    }
    Object.entries(variables).forEach(([key, value]) => {
      webSDK = webSDK.replace(`[[${key}]]`, `'${value}'`);
    })
    return webSDK
}