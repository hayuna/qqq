import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'

const delay = ms => {
    return new Promise(res => setTimeout(res, ms))
};

const PermissionGroup = {
    async recreate(application, domainName, acl) {
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId)
        data.append("groupID", this.generatePermissionGroupName(domainName))
        data.append("aclID", acl)

        data.append("scope", JSON.stringify({
            allowSites: [apiKey]
        }))
        data.append("setUsers", JSON.stringify([application.userKey]))

        const permissionGroup = await api(data, "/admin.createGroup");
        permissionGroup.name = this.generatePermissionGroupName(domainName)
        return permissionGroup
    },

    async create(application, domainName, ACLs) {
        console.log('\x1b[36m%s\x1b[0m', `17/18 Creating permission group in ${environment}`)

        let success = false
        let counter = 0
        let message = ''
        let permissionGroup
        while (!success && counter < 30) {
            await delay(3000)
            permissionGroup = await this.recreate(application.user, domainName, ACLs.standard_application.name)
            console.log(permissionGroup)
            if (!permissionGroup.errorCode) {
                success = true
                message = null
            } else {
                counter++
                message = permissionGroup.errorDetails || permissionGroup.errorMessage
            }
        }
        success
            ? console.log('\x1b[36m%s\x1b[0m', `18/18 Permission group has been created in ${environment}`)
            : console.log('\x1b[41m%s\x1b[0m', `Error during creating Permission group in ${environment}`)
        return { success, counter, message, permissionGroup }
    },

    generatePermissionGroupName(domainName) {
        return `api_${domainName}_${body.system}`.toLowerCase();
    },

    async isNameAvailable(name){
        const groupName = this.generatePermissionGroupName(name)
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId)
        
        const groupNames = await api(data, '/admin.getGroups')
        const found = Object.keys(groupNames.groups).find((group) => group === groupName)
        return !found
    }
}

export default PermissionGroup