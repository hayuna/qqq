import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { Console, dataCenterConverter, getPartnerIdKey, isRU } from '../../utils.js'

const Site = {
    async create(siteName) {
        Console.log('7. Creating children apikey')
        const data = new FormData();
        data.append("dataCenter", dataCenterConverter(body.dataCenter));
        data.append("partnerID", CONFIG[environment][getPartnerIdKey()]);
        data.append("baseDomain", siteName);

        const response = await api.admin(data, '/admin.createSite', isRU())
        Console.log('✅ Children apikey has been created')
        return response
    },

    async connectWithParent() {
        Console.log('8 Creating connection with parent apikey')
        const data = new FormData();
        data.append("apiKey", apiKey);
        data.append("siteGroupOwner", CONFIG[environment].parentApiKey[body.dataCenter]);

        const response = await api.admin(data, '/admin.setSiteConfig', isRU())
        Console.log('✅ Connection with parent apikey has been created')
        return response
    },

    generateName() {
        Console.log('2. Generating domain name')
        const purpose = body.purpose
        Console.log('✅ Domain name was generated')
        return `${environment}_${body.dataCenter}_${body.countryCode}${purpose ? '_' + purpose : ''}`.toLowerCase();
    },

    async isNameAvailable(name){
        Console.log('3. Checking site name')
        const data = new FormData();
        const siteNames = await api.admin(data, '/admin.getUserSites', isRU())
        const found = siteNames
            .sites.find((partner) => partner.partnerID === parseInt(CONFIG[environment][getPartnerIdKey()]))
            .sites.find(site => site.baseDomain === name)

        if(found) {
            throw new Error('❌ This name for apiKey exists')
        } else {
            Console.log('✅ Site name is available')
        }
    }
}

export default Site