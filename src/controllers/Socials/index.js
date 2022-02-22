import FormData from "form-data";
import { api } from "../../api.js";
import config from "../../config.js";

const Socials = {
    async get(){
        const data = new FormData()
        data.append('apiKey', config.MASTER_TEMPLATE.apiKey)
        data.append('includeSettings', 'true')
        data.append('includeCapabilities', 'true')
        data.append('includeSecretKeys', 'true')
        
        const response = await api.socialize(data, '/socialize.getProvidersConfig')
        const socials = {
            facebook: response.providers.facebook,
            googleplus: response.providers.googleplus,
            linkedin: response.providers.linkedin,
            capabilities: response.capabilities,
            settings: response.settings
        }
        return socials
    },
    
    async set({ capabilities, settings, ...providers}){
        const data = new FormData()
        data.append('apiKey', apiKey)
        data.append('settings', settings)
        data.append('capabilities', capabilities)
        data.append('providers', JSON.stringify(providers))
        const response = await api.socialize(data, '/socialize.setProvidersConfig')
        return response
    }
}

export default Socials