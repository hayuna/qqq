import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'

const WebSDK = {
    async get() {
        console.log('\x1b[36m%s\x1b[0m', '7/18 Retrieve WebSDK from Master Template')
        const data = new FormData();
        data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey);
        data.append('includeGlobalConf', 'true');

        const masterConfig = await api(data, '/admin.getSiteConfig')
        console.log('\x1b[36m%s\x1b[0m', '8/18 WebSDK from Master Template was retrieved')
        return masterConfig
    },

    async set(masterWebSDK) {
        console.log('\x1b[36m%s\x1b[0m', '9/18 Setting WebSDK')
        const data = new FormData();
        data.append("apiKey", apiKey);

        masterWebSDK = this.replaceVariablesInWebSDK(masterWebSDK)
        data.append('globalConf', masterWebSDK)

        const response = await api(data, '/admin.setSiteConfig')
        console.log('\x1b[36m%s\x1b[0m', '10/18 WebSDK was set')
        return response
    },

    replaceVariablesInWebSDK(webSDK) {
        webSDK = webSDK.replace(`[[ENV]]`, environment.toLowerCase())
        if (body.multicountry) {
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