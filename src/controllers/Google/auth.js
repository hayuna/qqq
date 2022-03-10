import { google } from 'googleapis'
import config from './config.js'
import fs from 'fs'

let key
if(!process.env.GOOGLE_PRIVATE_KEY){
    key = JSON.parse(fs.readFileSync('src/controllers/Google/credentials.json', 'utf-8'))
}
 
const auth = new google.auth.JWT(
    config.GOOGLE_SERVICE_ACCOUNT_EMAIL, 
    null, 
    process.env.GOOGLE_PRIVATE_KEY || key.private_key, 
    ["https://www.googleapis.com/auth/drive"]
)

auth.authorize()

export default auth