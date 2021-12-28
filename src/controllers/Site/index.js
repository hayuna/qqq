import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { dataCenterConverter } from '../../utils.js'

const Site = {
    async create(siteName) {
        console.log('3/18 Create children apikey')
        const data = new FormData();
        data.append("dataCenter", dataCenterConverter(body.dataCenter));
        data.append("partnerID", CONFIG[environment].partnerId);
        data.append("baseDomain", siteName);

        const response = await api(data, '/admin.createSite')
        console.log('4/18 Children apikey has been created')
        return response
    },

    async connectWithParent() {
        console.log('5/18 Create connection with parent apikey')
        const data = new FormData();
        data.append("apiKey", apiKey);
        data.append("siteGroupOwner", CONFIG[environment].parentApiKey[body.dataCenter]);

        const response = await api(data, '/admin.setSiteConfig')
        console.log('6/18 Connection with parent apikey has been created')
        return response
    },

    generateName() {
        console.log('1/18 Generating domain name')
        const purpose = body.purpose
        console.log('2/18 Domain name was generated')
        return `${environment}_${body.dataCenter}_${body.countryCode}${purpose ? '_' + purpose : ''}`.toLowerCase();
    }
}

export default Site