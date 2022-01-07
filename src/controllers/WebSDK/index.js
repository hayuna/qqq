import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { Console, isRU } from "../../utils.js";

const WebSDK = {
    async get() {
        Console.log('13. Retrieving WebSDK from Master Template')
        const data = new FormData();
        data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey);
        data.append('includeGlobalConf', 'true');

        const masterConfig = await api.admin(data, '/admin.getSiteConfig')
        Console.log('✅ WebSDK from Master Template was retrieved')
        return masterConfig
    },

    async set(masterWebSDK) {
        Console.log('14. Setting WebSDK')
        const data = new FormData();
        data.append("apiKey", apiKey);

        masterWebSDK = this.replaceVariablesInWebSDK(masterWebSDK)
        data.append('globalConf', masterWebSDK)

        const response = await api.admin(data, '/admin.setSiteConfig', isRU())
        Console.log('✅ WebSDK was set')
        return response
    },

    replaceVariablesInWebSDK(webSDK) {
        Console.log('___ Replacing variables in WebSDK')
        webSDK = webSDK.replace(`[[ENV]]`, environment.toLowerCase())
        Console.log(`___ ✅ [[ENV]] has been replaced with ${environment.toLowerCase()}`)
        if (Boolean(body.multicountry)) {
            webSDK = webSDK.replace(`[[MULTI_COUNTRY]]`, body.countryCode.toUpperCase())
            webSDK = webSDK.replace(`countryCode: '[[COUNTRY_CODE]]',`, '')
            Console.log(`___ ✅ [[MULTI_COUNTRY]] has been replaced with ${body.countryCode.toUpperCase()}`)
        } else {
            webSDK = webSDK.replace(`[[COUNTRY_CODE]]`, body.countryCode.toUpperCase())
            webSDK = webSDK.replace(`multicountry: '[[MULTI_COUNTRY]]',`, '')
            Console.log(`___ ✅ [[COUNTRY_CODE]] has been replaced with ${body.countryCode.toUpperCase()}`)
        }

        return webSDK
    }
}

export default WebSDK