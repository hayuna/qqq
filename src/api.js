import axios from "axios";
import { dataCenterInURL } from "./utils.js";

export const api = async (data, body, url) => {
  const config = {
    method: "post",
    url: `https://accounts.${dataCenterInURL(body.dataCenter)}.gigya.com${url}`,
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};
