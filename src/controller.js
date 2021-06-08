import CONFIG from "./config.js";
import { dataCenterConverter, createDomainName } from './utils.js'
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
}

const createDomain = async (environment, siteName, body) => {
  console.log('2/3 Create children apikey')
  const data = new FormData();
  data.append("secret", body.secret);
  data.append("userKey", body.userKey);
  data.append("dataCenter", dataCenterConverter(body.dataCenter));
  data.append("partnerID", CONFIG[environment].partnerId);
  data.append("baseDomain", siteName);

  const response = await api(data, body, '/admin.createSite')
  console.log('2/3 Children apikey has been created')
  return response
};

const connectWithParent = async (environment, apiKey, body) => {
  console.log('3/3 Create connection with parent apikey')
  const data = new FormData();
  data.append("secret", body.secret);
  data.append("userKey", body.userKey);
  data.append("apiKey", apiKey);
  data.append("siteGroupOwner", CONFIG[environment].parentApiKey[body.dataCenter]);

  const response = await api(data, body, '/admin.setSiteConfig')
  console.log('3/3 Connection with parent apikey has been created')
  return response
};
