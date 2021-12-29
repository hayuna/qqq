import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { dataCenterConverter } from '../../utils.js'

const Site = {
    async create(siteName) {
        console.log('\x1b[36m%s\x1b[0m', '3/18 Create children apikey')
        const data = new FormData();
        data.append("dataCenter", dataCenterConverter(body.dataCenter));
        data.append("partnerID", CONFIG[environment].partnerId);
        data.append("baseDomain", siteName);

        const response = await api(data, '/admin.createSite')
        console.log('\x1b[36m%s\x1b[0m', '4/18 Children apikey has been created')
        return response
    },

    async connectWithParent() {
        console.log('\x1b[36m%s\x1b[0m', '5/18 Create connection with parent apikey')
        const data = new FormData();
        data.append("apiKey", apiKey);
        data.append("siteGroupOwner", CONFIG[environment].parentApiKey[body.dataCenter]);

        const response = await api(data, '/admin.setSiteConfig')
        console.log('\x1b[36m%s\x1b[0m', '6/18 Connection with parent apikey has been created')
        return response
    },

    generateName() {
        console.log('\x1b[36m%s\x1b[0m', '1/18 Generating domain name')
        const purpose = body.purpose
        console.log('\x1b[36m%s\x1b[0m', '2/18 Domain name was generated')
        return `${environment}_${body.dataCenter}_${body.countryCode}${purpose ? '_' + purpose : ''}`.toLowerCase();
    },

    async isNameAvailable(name){
        const data = new FormData();
        const siteNames = await api(data, '/admin.getUserSites')
        const found = siteNames
            .sites.find((partner) => partner.partnerID === parseInt(CONFIG[environment].partnerId))
            .sites.find(site => site.baseDomain === name)
        return !found
    }
}

export default Site