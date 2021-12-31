import FormData from "form-data";
import { screenSetsAPI } from "../../api.js";
import CONFIG from '../../config.js'
import { Console } from "../../utils.js";

const Screenset = {
    async getAll() {
        const data = new FormData();
        data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey);
        data.append("include", 'html,css,javascript,translations,metadata,screenSetID');

        const masterScreenSets = await screenSetsAPI(data, '/accounts.getScreenSets', true)
        Console.log(`8/18 ScreenSets from Master Template was retrieved`)
        return masterScreenSets
    },

    async set(screenSetConfig) {
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
            await screenSetsAPI(data, '/accounts.setScreenSet')
            Console.log(`${screenSet.screenSetID} was added`)
        }
    },
}

export default Screenset