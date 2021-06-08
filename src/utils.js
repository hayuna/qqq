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
    console.log('1/3 Generating domain name')
    const purpose = body.purpose
    console.log('1/3 Domain name was generated')
    return `${environment}_${body.dataCenter}_${body.countryCode}${purpose ? '_'+purpose : ''}`.toLowerCase();
};