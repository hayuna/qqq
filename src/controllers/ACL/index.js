import FormData from "form-data";
import _ from 'lodash'
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { Console } from "../../utils.js";

const ACL = {
    async getAll() {
        Console.log('15. Retrieving ACLs from Master Template')
        const listOfACL = []
      
        const calls = []
        CONFIG.MASTER_TEMPLATE.ACLs.forEach((aclId) => {
          calls.push(this.get(aclId, true))
        })
      
        const response = await Promise.all(calls)
      
        response.forEach(ACL => {
          listOfACL[ACL.name] = ACL
        })
        Console.log('✅ ACLs have been retrieved from Master Template')
      
        return listOfACL;
      },
      
      async get(aclId, fromMaster) {
        const data = new FormData();
        data.append("aclID", aclId);
      
        const source = fromMaster
          ? CONFIG.MASTER_TEMPLATE.partnerId
          : CONFIG[environment].partnerId;
      
        data.append("partnerID", source);
      
        const ACL = await api.admin(data, "/admin.getACL");
        ACL.name = aclId
        if(fromMaster){
          Console.log(`___ ${aclId} ACL has been retrieved from Master Template`)
        } else {
          Console.log(`___ ${aclId} ACL has been retrieved from ${environment}`)
        }
        return ACL;
      },
      
      async setAll(ACLs) {
        Console.log(`16. Saving ACLs into ${environment}`)
        const calls = []
        CONFIG[environment].ACLs.forEach((aclId) => {
          calls.push(this.set(aclId, ACLs))
        })
      
        const response = await Promise.all(calls)
        Console.log(`✅ ACLs have been saved into ${environment}`)
        return response;
      },
      
      async set(aclId, masterACLs) {
        Console.log(`___ Setting ${aclId} ACL into ${environment}`)
        const masterACL = masterACLs[aclId]
        const siteACL = await this.get(aclId);
      
        if(this.compareACLs(masterACL.acl, siteACL.acl)) {
          Console.log(`___ ⏭  ${aclId} ACL skipped - it's equal to the one from Master Template `)
          return;
        }
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId);
        data.append("aclID", aclId);
        data.append("acl", JSON.stringify(masterACL.acl));
        
        const newACL = await api.admin(data, "/admin.setACL");
        Console.log(`___ ${aclId} ACL has been saved to ${environment}`)
        return newACL
      },

      async create(domainName){
        Console.log('17. Creating new ACL')
        const name = `api_${domainName}_${body.system}`.toLowerCase();
        const standardApplicationACL = await this.get('standard_application', true)
        standardApplicationACL.acl._inherit.push("_accountsFullAccess")
        
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId);
        data.append("aclID", name);
        data.append("acl", JSON.stringify(standardApplicationACL.acl));
        
        const newACL = await api.admin(data, "/admin.setACL");

        Console.log(`✅ ACL has been created with name: ${name}`)
      },

      compareACLs(masterACL, environmentACL) {
        return _.isEqual(masterACL, environmentACL)
    }
}

export default ACL
