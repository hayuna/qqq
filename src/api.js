import axios from "axios";
import https from "https";
import { dataCenterConverter, Console, dataCenterInURL } from "./utils.js";

const agent = new https.Agent({
  rejectUnauthorized: false
});

export const api = {
  async admin(data, url, isRU) {
    let dc = dataCenterInURL(body.dataCenter)
    let userKey = body.userKey
    let secret = body.secret

    // all admin endpoints for RU has dc ru1, but getSiteConfig retrieved from US/EU should have us1
    if (url === '/admin.getSiteConfig') {
      dc = 'us1'
    } else {
      if (isRU) {
        secret = body.secretRU
        userKey = body.userKeyRU
      }
    }

    if (url === '/admin.getACL') {
      dc = 'us1'
    } else {
      if (isRU) {
        secret = body.secretRU
        userKey = body.userKeyRU
      }
    }

    data.append("secret", secret);
    data.append("userKey", userKey);

    const config = {
      method: "post",
      url: `https://admin.${dc}.gigya.com${url}`,
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
      Console.error(e);
    }
  },

  async accounts(data, url, fromMaster, isRU) {
    if (isRU) {
      data.append("secret", body.secretRU);
      data.append("userKey", body.userKeyRU);
    } else {
      data.append("secret", body.secret);
      data.append("userKey", body.userKey);
    }

    const config = {
      method: "post",
      url: `https://accounts.${fromMaster ? 'eu1' : dataCenterConverter(body.dataCenter)}.gigya.com${url}`,
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
      Console.error(e);
    }
  },

  async etl(data, url, fromMaster, isRU) {
    if (isRU) {
      data.append("secret", body.secretRU);
      data.append("userKey", body.userKeyRU);
    } else {
      data.append("secret", body.secret);
      data.append("userKey", body.userKey);
    }

    const config = {
      method: "post",
      url: `https://idx.${fromMaster ? 'eu1' : dataCenterConverter(body.dataCenter)}.gigya.com${url}`,
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
      Console.error(e);
    }
  },

  async socialize(data, url, fromMaster, isRU){
    if (isRU) {
      data.append("secret", body.secretRU);
      data.append("userKey", body.userKeyRU);
    } else {
      data.append("secret", body.secret);
      data.append("userKey", body.userKey);
    }

    const config = {
      method: "post",
      url: `https://socialize.${fromMaster ? 'eu1' : dataCenterConverter(body.dataCenter)}.gigya.com${url}`,
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
      Console.error(e);
    }
  }
}
