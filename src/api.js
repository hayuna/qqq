import axios from "axios";
import https from "https";
import { dataCenterConverter, Console } from "./utils.js";

const agent = new https.Agent({
  rejectUnauthorized: false
});

export const api = {
  async admin(data, url, isRU) {
    if (isRU) {
      data.append("secret", body.secretRU);
      data.append("userKey", body.userKeyRU);
    } else {
      data.append("secret", body.secret);
      data.append("userKey", body.userKey);
    }

    const config = {
      method: "post",
      url: `https://admin.${dataCenterInURL(body.dataCenter)}.gigya.com${url}`,
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