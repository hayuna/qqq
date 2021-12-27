import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'

const Application = {
    async create(siteName) {
        console.log(`15/18 Creating application into ${environment}`)
        const data = new FormData();
        data.append("name", `${siteName}_${body.system}_created${this.generateCreationDate()}`.toLowerCase())
        data.append("keyType", "highRate")
        data.append("ownerPartnerId", CONFIG[environment].partnerId)

        const newApplication = await api(data, "/admin.createUserKey");
        console.log(`16/18 Application has been created in ${environment}`)

        return newApplication
    },

    async assignToGroup(application) {
        console.log(`___ Adding application to group into ${environment}`)
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId)
        data.append("groupID", '_no_permissions')
        data.append("addUsers", JSON.stringify([application.userKey]))

        const permissionGroup = await api(data, "/admin.updateGroup");
        permissionGroup.name = '_no_permissions'
        console.log(`___ Application has been added to group into ${environment}`)
        return permissionGroup
    },

    generateCreationDate () {
        const date = new Date();
        const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        return `${year}-${month}-${day}`
    }
    
}

export default Application