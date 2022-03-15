declare global {
    var body: {
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
    var environment: any;
    var apiKey: string;
  }

  declare var body: string;
  declare var apiKey: string;
  declare var environment: any;

export { };
