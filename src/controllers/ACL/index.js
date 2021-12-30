import FormData from "form-data";
import _ from 'lodash'
import { api } from "../../api.js";
import CONFIG from '../../config.js'
import { Console } from "../../utils.js";

const ACL = {
    async getAll() {
        Console.log('11/18 Retrieve ACLs from Master Template')
        const listOfACL = []
      
        const calls = []
        CONFIG.MASTER_TEMPLATE.ACLs.forEach((aclId) => {
          calls.push(this.get(aclId))
        })
      
        const response = await Promise.all(calls)
      
        response.forEach(ACL => {
          listOfACL[ACL.name] = ACL
        })
        Console.log('12/18 ACLs have been retrieved from Master Template')
      
        return listOfACL;
      },
      
      async get(aclId, fromMaster) {
        Console.log(`___ Retrieving ${aclId} ACL`)
        const data = new FormData();
        data.append("aclID", aclId);
      
        const source = fromMaster
          ? CONFIG.MASTER_TEMPLATE.partnerId
          : CONFIG[environment].partnerId;
      
        data.append("partnerID", source);
      
        const ACL = await api(data, "/admin.getACL");
        ACL.name = aclId
        Console.log(`___ ${aclId} ACL has been retrieved`)
        return ACL;
      },
      
      async setAll() {
        Console.log(`13/18 Saving ACLs into ${environment}`)
        const calls = []
        CONFIG[environment].ACLs.forEach((aclId) => {
          calls.push(this.set(aclId))
        })
      
        const response = await Promise.all(calls)
        Console.log(`14/18 ACLs have been saved into ${environment}`)
        return response;
      },
      
      async set(aclId) {
        Console.log(`___ Setting ${aclId} ACL into ${environment}`)
        const masterACL = await this.get(aclId, true);
        const siteACL = await this.get(aclId);
      
        if(this.compareACLs(masterACL.acl, siteACL.acl)) return;
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId);
        data.append("aclID", aclId);
        data.append("acl", JSON.stringify(masterACL.acl));
        
        const newACL = await api(data, "/admin.setACL");
        Console.log(`___ ${aclId} ACL has been saved to ${environment}`)
        return newACL
      },

      async create(domainName){
        const name = `api_${domainName}_${body.system}`.toLowerCase();
        const standardApplicationACL = await this.get('standard_application', true)
        standardApplicationACL.acl._inherit.push("_accountsFullAccess")
        
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId);
        data.append("aclID", name);
        data.append("acl", JSON.stringify(standardApplicationACL.acl));
        
        const newACL = await api(data, "/admin.setACL");
        console.log({newACL})
      },

      compareACLs(masterACL, environmentACL) {
        return _.isEqual(masterACL, environmentACL)
    }
}

export default ACL
