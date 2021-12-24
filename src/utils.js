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

export const errorHandler = (object) => {
    if (object?.errorCode) {
        console.log(object);
        throw new Error(object.errorDetails || object.errorMessage);
    }
};
