import FormData from "form-data";
import { api } from "./api.js";

export const deleteSite = async (req, res) => {
  try {
    await delSite(req.body)
    res.json({ message: 'OK' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};

const delSite = async (body) => {
  body.dataCenter = 'US'  
  body.apiKeys.forEach(async(apiKey) => {
    const data = new FormData();
    data.append("apiKey", apiKey);

    const response = await api(data, body, '/admin.deleteSite')
    console.log({response})

    const data2 = new FormData();
    data2.append("deleteToken", response.deleteToken);
    data2.append("apiKey", apiKey);

    const response2 = await api(data2, body, '/admin.deleteSite')
    console.log({response2})
    

  })
  
}
