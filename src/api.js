import axios from "axios";
import https from "https";
import { dataCenterConverter, Console } from "./utils.js";

const agent = new https.Agent({
  rejectUnauthorized: false
});

export const api = {
  async admin(data, url) {
    data.append("secret", body.secret);
    data.append("userKey", body.userKey);

    const config = {
      method: "post",
      url: `https://accounts.us1.gigya.com${url}`,
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

  async accounts(data, url, fromMaster) {
    data.append("secret", body.secret);
    data.append("userKey", body.userKey);

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

  async etl(data, url, fromMaster) {
    data.append("secret", body.secret);
    data.append("userKey", body.userKey);

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

  async socialize(data, url, fromMaster){
    data.append("secret", body.secret);
    data.append("userKey", body.userKey);

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