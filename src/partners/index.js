import config from '../config.js'
import { Console } from '../utils.js';

export const getPartners = async (req, res) => {
    try {
      global.body = req.body
      const response = Object.entries(config).reduce((acc, [key, value]) => {
          acc.push({
            id: value.order,
            partnerId: value.partnerId,
            name: key
        })
        return acc 
      }, [])
      res.json({ data: response });
    } catch (error) {
      Console.log(error)
      res.status(500).json({ message: error.message });
    }
  };


