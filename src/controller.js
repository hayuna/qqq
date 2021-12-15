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
import { etlController } from "./ETL/controller.js";

export const createSite = async (req, res) => {
  try {
    global.body = req.body
    await create('SANDBOX')
    // await create('DEV')
    // await create('TEST')
    // await create('PROD')
    res.json({ message: 'OK' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const create = async (environment) => {
  global.environment = environment
  const domainName = createDomainName();
  
  const site = await createDomain(domainName)
  errorHandler(site)
  
  const connection = await connectWithParent(site.apiKey)
  errorHandler(connection)
  
  const masterWebSDK = await getWebSDK()
  errorHandler(masterWebSDK)

  const newWebSDK = await setWebSDK(masterWebSDK.globalConf, site.apiKey)
  errorHandler(newWebSDK)

  const ACLs = await getACLs();
  errorHandler(ACLs)
  
  const newACLs = await setACLs()
  errorHandler(newACLs)
  
  const application = await createApplication(domainName)
  errorHandler(application)

  const applicationInConsole = await addApplicationToGroup(application.user)
  errorHandler(applicationInConsole)

  const response = await createPermissionGroupRepeater(application, domainName, site, ACLs)
  errorHandler(response.permissionGroup)
  console.log(response)

  const ETL = await etlController(site.apiKey)
  errorHandler(ETL)
  console.log(ETL)
}

const createDomain = async (siteName) => {
  console.log('3/18 Create children apikey')
  const data = new FormData();
  data.append("dataCenter", dataCenterConverter(body.dataCenter));
  data.append("partnerID", CONFIG[environment].partnerId);
  data.append("baseDomain", siteName);

  const response = await api(data, '/admin.createSite')
  console.log('4/18 Children apikey has been created')
  return response
};

const connectWithParent = async (apiKey) => {
  console.log('5/18 Create connection with parent apikey')
  const data = new FormData();
  data.append("apiKey", apiKey);
  data.append("siteGroupOwner", CONFIG[environment].parentApiKey[body.dataCenter]);

  const response = await api(data, '/admin.setSiteConfig')
  console.log('6/18 Connection with parent apikey has been created')
  return response
};

const getWebSDK = async () => {
  console.log('7/18 Retrieve WebSDK from Master Template')
  const data = new FormData();
  data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey);
  data.append('includeGlobalConf', 'true');
    
  const masterConfig = await api(data, '/admin.getSiteConfig')
  console.log('8/18 WebSDK from Master Template was retrieved')
  return masterConfig
}

const setWebSDK = async (masterWebSDK, apiKey) => {
  console.log('9/18 Setting WebSDK')
  const data = new FormData();
  data.append("apiKey", apiKey);
  
  masterWebSDK = replaceVariablesInWebSDK(masterWebSDK)
  data.append('globalConf', masterWebSDK)
  
  const response = await api(data, '/admin.setSiteConfig')
  console.log('10/18 WebSDK was set')
  return response
}

const getACLs = async () => {
  console.log('11/18 Retrieve ACLs from Master Template')
  const listOfACL = []

  const calls = []
  CONFIG.MASTER_TEMPLATE.ACLs.forEach((aclId) => {
    calls.push(getACL(aclId))
  })

  const response = await Promise.all(calls)

  response.forEach(ACL => {
    listOfACL[ACL.name] = ACL
  })
  console.log('12/18 ACLs have been retrieved from Master Template')

  return listOfACL;
};

const getACL = async (aclId, fromMaster) => {
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
};

const setACLs = async () => {
  console.log(`13/18 Saving ACLs into ${environment}`)
  const calls = []
  CONFIG[environment].ACLs.forEach((aclId) => {
    calls.push(setACL(aclId))
  })

  const response = await Promise.all(calls)
  console.log(`14/18 ACLs have been saved into ${environment}`)
  return response;
};

const setACL = async (aclId) => {
  console.log(`___ Setting ${aclId} ACL into ${environment}`)
  const masterACL = await getACL(aclId, true);
  const siteACL = await getACL(aclId);

  if(compareACLs(masterACL.acl, siteACL.acl)) return;
  const data = new FormData();
  data.append("partnerID", CONFIG[environment].partnerId);
  data.append("aclID", aclId);
  data.append("acl", JSON.stringify(masterACL.acl));
  
  const newACL = await api(data, "/admin.setACL");
  console.log(`___ ${aclId} ACL has been saved to ${environment}`)
  return newACL
};

const createApplication = async (siteName) => {
  console.log(`15/18 Creating application into ${environment}`)
  const date = new Date();
  const data = new FormData();
  data.append("name", `${siteName}_${body.system}_created${generateCreationDate(date)}`.toLowerCase())
  data.append("keyType", "highRate")
  data.append("ownerPartnerId", CONFIG[environment].partnerId)
  
  const newApplication = await api(data, "/admin.createUserKey");
  console.log(`16/18 Application has been created in ${environment}`)

  return newApplication
};

const addApplicationToGroup = async (application) => {
  console.log(`___ Adding application to group into ${environment}`)
  const data = new FormData();
  data.append("partnerID", CONFIG[environment].partnerId)
  data.append("groupID", '_no_permissions')
  data.append("addUsers", JSON.stringify([application.userKey])) 

  const permissionGroup = await api(data, "/admin.updateGroup");
  permissionGroup.name = '_no_permissions'
  console.log(`___ Application has been added to group into ${environment}`)
  return permissionGroup
}

const createPermissionGroup = async(application, domainName, apiKey, acl) => {
  const data = new FormData();
  data.append("partnerID", CONFIG[environment].partnerId)
  data.append("groupID", generatePermissionGroupName(domainName, body.system))
  data.append("aclID", acl)
  
  data.append("scope", JSON.stringify({
    allowSites: [apiKey]
  }))
  data.append("setUsers", JSON.stringify([application.userKey])) 

  const permissionGroup = await api(data, "/admin.createGroup");
  permissionGroup.name = generatePermissionGroupName(domainName, body.system)
  return permissionGroup
} 

const createPermissionGroupRepeater = async (application, domainName, site, ACLs) => {
  console.log(`17/18 Creating permission group in ${environment}`)

  let success = false
  let counter = 0
  let message = ''
  let permissionGroup
  while(!success && counter < 30){
    await delay(3000)
    permissionGroup = await createPermissionGroup(application.user, domainName, site.apiKey, ACLs.standard_application.name)
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
