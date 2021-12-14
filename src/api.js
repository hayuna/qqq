import axios from "axios";
import https from "https";
import { dataCenterInURL } from "./utils.js";

export const api = async (data, url) => {
  data.append("secret", body.secret);
  data.append("userKey", body.userKey);

  const agent = new https.Agent({  
    rejectUnauthorized: false
  });

  const config = {
    method: "post",
    url: `https://accounts.${dataCenterInURL(body.dataCenter)}.gigya.com${url}`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
    httpsAgent: agent,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const etlAPI = async (data, url) => {
  data.append("secret", body.secret);
  data.append("userKey", body.userKey);

  const agent = new https.Agent({  
    rejectUnauthorized: false
  });

  const config = {
    method: "post",
    url: `https://idx.${dataCenterInURL(body.dataCenter)}.gigya.com${url}`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
    httpsAgent: agent,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const etlMasterAPI = async (data, url) => {
  data.append("secret", body.secret);
  data.append("userKey", body.userKey);

  const agent = new https.Agent({  
    rejectUnauthorized: false
  });

  const config = {
    method: "post",
    url: `https://idx.eu1.gigya.com${url}`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
    httpsAgent: agent,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
