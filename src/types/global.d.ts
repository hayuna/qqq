declare global {
  var environment: string;
  namespace NodeJS {
    interface Global {

    body: {
        dataCenter: string;
        userKey: string;
        secret: string;
        userKeyRU: string;
        secretRU: string;
        system: string;
        language: string;
        countryCode: string;
        countryFullname: string;
        multicountry: boolean;
        purpose: string;
    };
    environment: string;
    apiKey: string;
      }
    }
  }


export { };
