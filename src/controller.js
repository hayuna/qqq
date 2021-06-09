import CONFIG from "./config.js";
import { dataCenterConverter, createDomainName, replaceVariablesInWebSDK } from './utils.js'
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
  await connectWithParent(environment, site.apiKey, body)
  const masterWebSDK = await getWebSDK(body)
  await setWebSDK(masterWebSDK.globalConf, site.apiKey, body)
}

const createDomain = async (environment, siteName, body) => {
  console.log('3/10 Create children apikey')
  const data = new FormData();
  data.append("secret", body.secret);
  data.append("userKey", body.userKey);
  data.append("dataCenter", dataCenterConverter(body.dataCenter));
  data.append("partnerID", CONFIG[environment].partnerId);
  data.append("baseDomain", siteName);

  const response = await api(data, body, '/admin.createSite')
  console.log('4/10 Children apikey has been created')
  return response
};

const connectWithParent = async (environment, apiKey, body) => {
  console.log('5/10 Create connection with parent apikey')
  const data = new FormData();
  data.append("secret", body.secret);
  data.append("userKey", body.userKey);
  data.append("apiKey", apiKey);
  data.append("siteGroupOwner", CONFIG[environment].parentApiKey[body.dataCenter]);

  const response = await api(data, body, '/admin.setSiteConfig')
  console.log('6/10 Connection with parent apikey has been created')
  return response
};

const getWebSDK = async (body) => {
  console.log('7/10 Retrieve WebSDK from Master Template')
  const data = new FormData();
  data.append("userKey", body.userKey);
  data.append("secret", body.secret);
  data.append("apiKey", CONFIG.MASTER_TEMPLATE.apiKey);
  data.append('includeGlobalConf', 'true');
    
  const masterConfig = await api(data, body, '/admin.getSiteConfig')
  console.log('8/10 WebSDK from Master Template was retrieved')
  return masterConfig
}

const setWebSDK = async (masterWebSDK, apiKey, body) => {
  console.log('9/10 Setting WebSDK')
  const data = new FormData();
  data.append("secret", body.secret);
  data.append("userKey", body.userKey);
  data.append("apiKey", apiKey);
  
  masterWebSDK = replaceVariablesInWebSDK(masterWebSDK, body)
  data.append('globalConf', masterWebSDK)
  
  const response = await api(data, body, '/admin.setSiteConfig')
  console.log('10/10 WebSDK was set')
  return response
}
