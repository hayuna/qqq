import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { Console } from "../../utils.js";

const WebSDK = {
    async get() {
        Console.log('7/18 Retrieve WebSDK from Master Template')
        const data = new FormData();
        data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey);
        data.append('includeGlobalConf', 'true');

        const masterConfig = await api(data, '/admin.getSiteConfig')
        Console.log('8/18 WebSDK from Master Template was retrieved')
        return masterConfig
    },

    async set(masterWebSDK) {
        Console.log('9/18 Setting WebSDK')
        const data = new FormData();
        data.append("apiKey", apiKey);

        masterWebSDK = this.replaceVariablesInWebSDK(masterWebSDK)
        data.append('globalConf', masterWebSDK)

        const response = await api(data, '/admin.setSiteConfig')
        Console.log('10/18 WebSDK was set')
        return response
    },

    replaceVariablesInWebSDK(webSDK) {
        webSDK = webSDK.replace(`[[ENV]]`, environment.toLowerCase())
        if (Boolean(body.multicountry)) {
            webSDK = webSDK.replace(`[[MULTI_COUNTRY]]`, body.countryCode.toUpperCase())
            webSDK = webSDK.replace(`countryCode: '[[COUNTRY_CODE]]',`, '')
        } else {
            webSDK = webSDK.replace(`[[COUNTRY_CODE]]`, body.countryCode.toUpperCase())
            webSDK = webSDK.replace(`multicountry: '[[MULTI_COUNTRY]]',`, '')
        }

        return webSDK
    }
}

export default WebSDK