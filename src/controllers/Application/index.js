import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { Console, getPartnerIdKey, isRU } from "../../utils.js";

const Application = {
    async create(siteName) {
        Console.log(`18. Creating application into ${environment}`)
        const data = new FormData();
        const applicationName = `${siteName}_${body.system}_created${this.generateCreationDate()}`.toLowerCase()
        data.append("name", applicationName)
        data.append("keyType", "highRate")
        data.append("ownerPartnerId", CONFIG[environment][getPartnerIdKey()])

        const newApplication = await api.admin(data, "/admin.createUserKey", isRU());
        Console.log(`✅ Application has been created in ${environment}`)

        return newApplication
    },

    async assignToGroup(application) {
        Console.log(`19. Adding application to group into ${environment}`)
        const data = new FormData();
        data.append("partnerID", CONFIG[environment][getPartnerIdKey()])
        data.append("groupID", '_no_permissions')
        data.append("addUsers", JSON.stringify([application.userKey]))

        const permissionGroup = await api.admin(data, "/admin.updateGroup", isRU());
        permissionGroup.name = '_no_permissions'
        Console.log(`✅ Application has been added to group into ${environment}`)
        return permissionGroup
    },

    generateCreationDate () {
        const date = new Date();
        const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        return `${year}-${month}-${day}`
    },

    async isNameAvailable(name){
        Console.log('4. Checking application name')
        const applicationName = `${name}_${body.system}_created${this.generateCreationDate()}`.toLowerCase()
        const data = new FormData();
        data.append("groupID", '_no_permissions')
        data.append("partnerID", CONFIG[environment][getPartnerIdKey()])
        
        const applicationNames = await api.admin(data, '/admin.getGroupUsers', isRU())
        const found = applicationNames.users.find(application => application.name === applicationName)
        
        if(found) {
            throw new Error('❌ This name for application exists')
        } else {
            Console.log('✅ Application name is available')
        }
    }
    
}

export default Application