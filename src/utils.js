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

export const Console = {
    log(e){
        console.log('\x1b[36m%s\x1b[0m', e);
    },
    error(e){
        console.log('\x1b[41m%s\x1b[0m', e);
    }
}