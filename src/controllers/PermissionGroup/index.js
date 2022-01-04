import FormData from "form-data";
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { Console } from "../../utils.js";

const delay = ms => {
    return new Promise(res => setTimeout(res, ms))
};

const PermissionGroup = {
    async recreate(application, domainName) {
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId)
        data.append("groupID", this.generatePermissionGroupName(domainName))
        data.append("aclID", this.generatePermissionGroupName(domainName))

        data.append("scope", JSON.stringify({
            allowSites: [apiKey]
        }))
        data.append("setUsers", JSON.stringify([application.userKey]))

        const permissionGroup = await api.admin(data, "/admin.createGroup");
        permissionGroup.name = this.generatePermissionGroupName(domainName)
        return permissionGroup
    },

    async create(application, domainName) {
        Console.log(`20. Creating permission group in ${environment}`)

        let success = false
        let counter = 0
        let message = ''
        let permissionGroup
        while (!success && counter < 30) {
            await delay(3000)
            permissionGroup = await this.recreate(application.user, domainName)
            if (!permissionGroup.errorCode) {
                success = true
                message = null
            } else {
                counter++
                message = permissionGroup.errorDetails || permissionGroup.errorMessage
            }
        }
        success
            ? Console.log(`✅ Permission group has been created in ${environment}`)
            : Console.error(`❌ Error during creating Permission group in ${environment}, retrying...`)
        return { success, counter, message, permissionGroup }
    },

    generatePermissionGroupName(domainName) {
        return `api_${domainName}_${body.system}`.toLowerCase();
    },

    async isNameAvailable(name){
        Console.log('5. Checking permission group name')
        const groupName = this.generatePermissionGroupName(name)
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId)
        
        const groupNames = await api.admin(data, '/admin.getGroups')
        const found = Object.keys(groupNames.groups).find((group) => group === groupName)

        if(found) {
            throw new Error('❌ This name for permission group exists')
        } else {
            Console.log('✅ Permission group name is available')
        }
    },

    async update(name) {
        const domainName = this.generatePermissionGroupName(name)
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId)
        data.append("groupID", domainName)
        data.append("aclID", domainName)

        const permissionGroup = await api.admin(data, "/admin.updateGroup");
        return permissionGroup
    },
}

export default PermissionGroup