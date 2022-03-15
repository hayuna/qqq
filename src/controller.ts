import {SomeFunction} from './utils'
import * as dotenv from 'dotenv'

dotenv.config()

export const createSite = async (req, res) => {
  try {
    await create('DEV')
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const create = async (environment) => {
  global.environment = environment
  SomeFunction();

  

}
