import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { Console } from "../../utils.js";

const Screenset = {
    async getAll() {
        Console.log('9. Retrieving screenSets from Master Template')
        const data = new FormData();
        data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey);
        data.append("include", 'html,css,javascript,translations,metadata,screenSetID');

        const masterScreenSets = await api.accounts(data, '/accounts.getScreenSets', true)
        Console.log(`✅ ScreenSets from Master Template were retrieved`)
        return masterScreenSets
    },

    async set(screenSetConfig) {
        Console.log('10. Set screenSets from Master Template')
        for (let i = 0; i < screenSetConfig.screenSets.length; i++) {
            const screenSet = screenSetConfig.screenSets[i]

            const data = new FormData();
            data.append('apiKey', apiKey)
            data.append('screenSetID', screenSet.screenSetID)
            data.append('html', screenSet.html)
            data.append('css', screenSet.css)
            data.append('javascript', screenSet.javascript)
            data.append('translations', JSON.stringify(screenSet.translations))
            data.append("metadata", JSON.stringify(screenSet.metadata))
            data.append('comment', 'Copied By Site Provisioner')
            data.append('format', 'json')
            await api.accounts(data, '/accounts.setScreenSet')
            Console.log(`___ ✅ ${screenSet.screenSetID} was set`)
        }
    },
}

export default Screenset