import { google } from 'googleapis';
import config from './config.js';
const drive = google.drive('v3')
import auth from './auth.js'
import fs from 'fs'
import {access} from 'fs/promises'
import { Console } from '../../utils.js';

const GDrive = {
    async checkCredentials(){
        Console.log('6. Checking google credentials')
        const cannotFind = {}
        if (!process.env.GOOGLE_PRIVATE_KEY) {
            cannotFind.GOOGLE_PRIVATE_KEY = true
        } else {
            Console.log('✅ GOOGLE_PRIVATE_KEY was set')
            return
        }

        const file = 'src/controllers/Google/credentials.json'
        try{
            await access(file, fs.constants.R_OK)
            Console.log('✅ Google Credentials file was found')
            return
        } catch(e) {
            cannotFind.CREDENTIALS_FILE = true
        }

        if(cannotFind.GOOGLE_PRIVATE_KEY) {
            throw new Error(`❌ Cannot find GOOGLE_PRIVATE_KEY to connect with Google Drive / Google Sheets. Please add key GOOGLE_PRIVATE_KEY to .env file. Instruction how to retrieve it you can find here: 
            https://code.roche.com/gigya-team/site-provisioner/-/blob/master/README.md#get-private-key-to-google`)
        } 

        if(cannotFind.CREDENTIALS_FILE) {
            throw new Error(`❌ Cannot find credentials file in path ${file}. Follow the instruction to avoid this problem: 
            https://code.roche.com/gigya-team/site-provisioner/-/blob/master/README.md#download-credentials-to-google-service-account`)
        }
    },

    async createFolder({ name, parent }) {
        Console.log(`26. Creating ${name} in ${environment} folder`)
        const newFolder = await drive.files.create({
            auth,
            supportsAllDrives: true,    
            requestBody: {
                driveId: config.SHARED_DRIVE,
                name,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parent]
            },
        })
        Console.log(`✅ ${environment}/${name} folder was created`);
        
        return newFolder
    },

    async renameAndMoveFile({fileId, newName, parent}) {
        Console.log(`27. Paste copied file to ${environment}/${newName} and rename file to ${newName}`)
        const renamedFile = await drive.files.update({
            auth, 
            fileId, 
            supportsAllDrives: true,
            requestBody: {
                driveId: config.SHARED_DRIVE,
                name: newName,
            },
            removeParents: config.TEMPLATE_FOLDER,
            addParents: parent
        })
        Console.log(`✅ file was moved and renamed`);
        return renamedFile
    },

    async makeACopy({fileId}) {
        Console.log('25. Making a copy of blueprint GSheet');
        const copiedFile = await drive.files.copy({
            auth,
            supportsAllDrives: true,
            fileId
        })
        Console.log('✅ blueprint GSheet was copied');
        
        return copiedFile
    }
}

export default GDrive