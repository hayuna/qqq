import CONFIG from "./config.js";
import {
  dataCenterConverter,
  createDomainName,
  replaceVariablesInWebSDK,
  compareACLs,
  generateCreationDate,
  generatePermissionGroupName,
  errorHandler,
  delay,
} from "./utils.js";
import FormData from "form-data";
import { api } from "./api.js";

export const createSite = async (req, res) => {
  try {
    await create('DEV', req.body)
    await create('TEST', req.body)
    await create('PROD', req.body)
    res.json({ message: 'OK' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const create = async (environment, body) => {
  const domainName = createDomainName(environment, body);
  
  const site = await createDomain(environment, domainName, body)
  errorHandler(site)
  
  const connection = await connectWithParent(environment, site.apiKey, body)
  errorHandler(connection)
  
  const masterWebSDK = await getWebSDK(body)
  errorHandler(masterWebSDK)

  const newWebSDK = await setWebSDK(masterWebSDK.globalConf, site.apiKey, body)
  errorHandler(newWebSDK)

  const ACLs = await getACLs(body);
  errorHandler(ACLs)
  
  const newACLs = await setACLs(body, environment)
  errorHandler(newACLs)
  
  const application = await createApplication(domainName, body, environment)
  errorHandler(application)

  const applicationInConsole = await addApplicationToGroup(application.user, environment, body)
  errorHandler(applicationInConsole)

  const response = await createPermissionGroupRepeater(application, domainName, site, ACLs, environment, body)
  errorHandler(response.permissionGroup)
  console.log(response)
}

const createDomain = async (environment, siteName, body) => {
  console.log('3/18 Create children apikey')
  const data = new FormData();
  data.append("dataCenter", dataCenterConverter(body.dataCenter));
  data.append("partnerID", CONFIG[environment].partnerId);
  data.append("baseDomain", siteName);

  const response = await api(data, body, '/admin.createSite')
  console.log('4/18 Children apikey has been created')
  return response
};

const connectWithParent = async (environment, apiKey, body) => {
  console.log('5/18 Create connection with parent apikey')
  const data = new FormData();
  data.append("apiKey", apiKey);
  data.append("siteGroupOwner", CONFIG[environment].parentApiKey[body.dataCenter]);

  const response = await api(data, body, '/admin.setSiteConfig')
  console.log('6/18 Connection with parent apikey has been created')
  return response
};

const getWebSDK = async (body) => {
  console.log('7/18 Retrieve WebSDK from Master Template')
  const data = new FormData();
  data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey);
  data.append('includeGlobalConf', 'true');
    
  const masterConfig = await api(data, body, '/admin.getSiteConfig')
  console.log('8/18 WebSDK from Master Template was retrieved')
  return masterConfig
}

const setWebSDK = async (masterWebSDK, apiKey, body) => {
  console.log('9/18 Setting WebSDK')
  const data = new FormData();
  data.append("apiKey", apiKey);
  
  masterWebSDK = replaceVariablesInWebSDK(masterWebSDK, body)
  data.append('globalConf', masterWebSDK)
  
  const response = await api(data, body, '/admin.setSiteConfig')
  console.log('10/18 WebSDK was set')
  return response
}

const getACLs = async (body) => {
  console.log('11/18 Retrieve ACLs from Master Template')
  const listOfACL = []

  const calls = []
  CONFIG.MASTER_TEMPLATE.ACLs.forEach((aclId) => {
    calls.push(getACL({ aclId, body }))
  })

  const response = await Promise.all(calls)

  response.forEach(ACL => {
    listOfACL[ACL.name] = ACL
  })
  console.log('12/18 ACLs have been retrieved from Master Template')

  return listOfACL;
};

const getACL = async ({ aclId, body, environment }) => {
  console.log(`___ Retrieving ${aclId} ACL`)
  const data = new FormData();
  data.append("aclID", aclId);

  const source = !environment
    ? CONFIG.MASTER_TEMPLATE.partnerId
    : CONFIG[environment].partnerId;

  data.append("partnerID", source);

  const ACL = await api(data, body, "/admin.getACL");
  ACL.name = aclId
  console.log(`___ ${aclId} ACL has been retrieved`)
  return ACL;
};

const setACLs = async (body, environment) => {
  console.log(`13/18 Saving ACLs into ${environment}`)
  const calls = []
  CONFIG[environment].ACLs.forEach((aclId) => {
    calls.push(setACL(body, environment, aclId))
  })

  const response = await Promise.all(calls)
  console.log(`14/18 ACLs have been saved into ${environment}`)
  return response;
};

const setACL = async (body, environment, aclId) => {
  console.log(`___ Setting ${aclId} ACL into ${environment}`)
  const masterACL = await getACL({aclId: aclId, body});
  const siteACL = await getACL({aclId: aclId, body, environment});

  if(compareACLs(masterACL.acl, siteACL.acl)) return;
  const data = new FormData();
  data.append("partnerID", CONFIG[environment].partnerId);
  data.append("aclID", aclId);
  data.append("acl", JSON.stringify(masterACL.acl));
  
  const newACL = await api(data, body, "/admin.setACL");
  console.log(`___ ${aclId} ACL has been saved to ${environment}`)
  return newACL
};

const createApplication = async (siteName, body, environment) => {
  console.log(`15/18 Creating application into ${environment}`)
  const date = new Date();
  const data = new FormData();
  data.append("name", `${siteName}_${body.system}_created${generateCreationDate(date)}`.toLowerCase())
  data.append("keyType", "highRate")
  data.append("ownerPartnerId", CONFIG[environment].partnerId)
  
  const newApplication = await api(data, body, "/admin.createUserKey");
  console.log(`16/18 Application has been created in ${environment}`)

  return newApplication
};

const addApplicationToGroup = async (application, environment, body) => {
  console.log(`___ Adding application to group into ${environment}`)
  const data = new FormData();
  data.append("partnerID", CONFIG[environment].partnerId)
  data.append("groupID", '_no_permissions')
  data.append("addUsers", JSON.stringify([application.userKey])) 

  const permissionGroup = await api(data, body, "/admin.updateGroup");
  permissionGroup.name = '_no_permissions'
  console.log(`___ Application has been added to group into ${environment}`)
  return permissionGroup
}

const createPermissionGroup = async(application, domainName, apiKey, acl, environment, body) => {
  const data = new FormData();
  data.append("partnerID", CONFIG[environment].partnerId)
  data.append("groupID", generatePermissionGroupName(domainName, body.system))
  data.append("aclID", acl)
  
  data.append("scope", JSON.stringify({
    allowSites: [apiKey]
  }))
  data.append("setUsers", JSON.stringify([application.userKey])) 

  const permissionGroup = await api(data, body, "/admin.createGroup");
  permissionGroup.name = generatePermissionGroupName(domainName, body.system)
  return permissionGroup
} 

const createPermissionGroupRepeater = async (application, domainName, site, ACLs, environment, body) => {
  console.log(`17/18 Creating permission group in ${environment}`)

  let success = false
  let counter = 0
  let message = ''
  let permissionGroup
  while(!success && counter < 30){
    await delay(3000)
    permissionGroup = await createPermissionGroup(application.user, domainName, site.apiKey, ACLs.standard_application.name, environment, body)
    console.log(permissionGroup)
    if(!permissionGroup.errorCode) { 
      success = true
      message = null
    } else {
      counter++
      message = permissionGroup.errorDetails || permissionGroup.errorMessage
    }            
  }
  success 
  ? console.log(`18/18 Permission group has been created in ${environment}`)
  : console.log(`Error during creating Permission group in ${environment}`)
  return {success, counter, message, permissionGroup}
}
