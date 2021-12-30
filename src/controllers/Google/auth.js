import { google } from 'googleapis'
import fs from 'fs'

const key = JSON.parse(fs.readFileSync('src/controllers/Google/credentials.json', 'utf-8'))

const auth = new google.auth.JWT(key.client_email, null, key.private_key, [
    "https://www.googleapis.com/auth/drive"
])

auth.authorize()

export default auth