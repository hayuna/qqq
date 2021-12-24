import FormData from "form-data";
import _ from 'lodash'
import { api } from "../../api.js";
import CONFIG from '../../config.js'

const ACL = {
    async getAll() {
        console.log('11/18 Retrieve ACLs from Master Template')
        const listOfACL = []
      
        const calls = []
        CONFIG.MASTER_TEMPLATE.ACLs.forEach((aclId) => {
          calls.push(this.get(aclId))
        })
      
        const response = await Promise.all(calls)
      
        response.forEach(ACL => {
          listOfACL[ACL.name] = ACL
        })
        console.log('12/18 ACLs have been retrieved from Master Template')
      
        return listOfACL;
      },
      
      async get(aclId, fromMaster) {
        console.log(`___ Retrieving ${aclId} ACL`)
        const data = new FormData();
        data.append("aclID", aclId);
      
        const source = fromMaster
          ? CONFIG.MASTER_TEMPLATE.partnerId
          : CONFIG[environment].partnerId;
      
        data.append("partnerID", source);
      
        const ACL = await api(data, "/admin.getACL");
        ACL.name = aclId
        console.log(`___ ${aclId} ACL has been retrieved`)
        return ACL;
      },
      
      async setAll() {
        console.log(`13/18 Saving ACLs into ${environment}`)
        const calls = []
        CONFIG[environment].ACLs.forEach((aclId) => {
          calls.push(this.set(aclId))
        })
      
        const response = await Promise.all(calls)
        console.log(`14/18 ACLs have been saved into ${environment}`)
        return response;
      },
      
      async set(aclId) {
        console.log(`___ Setting ${aclId} ACL into ${environment}`)
        const masterACL = await this.get(aclId, true);
        const siteACL = await this.get(aclId);
      
        if(this.compareACLs(masterACL.acl, siteACL.acl)) return;
        const data = new FormData();
        data.append("partnerID", CONFIG[environment].partnerId);
        data.append("aclID", aclId);
        data.append("acl", JSON.stringify(masterACL.acl));
        
        const newACL = await api(data, "/admin.setACL");
        console.log(`___ ${aclId} ACL has been saved to ${environment}`)
        return newACL
      },

      compareACLs(masterACL, environmentACL) {
        return _.isEqual(masterACL, environmentACL)
    }
}

export default ACL
