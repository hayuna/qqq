import { google } from 'googleapis';
import config from './config.js';
const drive = google.drive('v3')
import auth from './auth.js'
import fs from 'fs'
import {access} from 'fs/promises'

const GDrive = {
    async checkCredentials(){
        const file = 'src/controllers/Google/credentials.json'
        try{
            await access(file, fs.constants.R_OK)
        } catch(e) {
            throw new Error(`Cannot find credentials file in path ${file}. Follow the instruction to avoid this problem: https://code.roche.com/gigya-team/site-provisioner/-/blob/master/README.md#download-credentials-to-google-service-account`)
        }
    },

    async createFolder({ name, parent }) {
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
        return newFolder
    },

    async renameAndMoveFile({fileId, newName, parent}) {
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
        return renamedFile
    },

    async makeACopy({fileId}) {
        const copiedFile = await drive.files.copy({
            auth,
            supportsAllDrives: true,
            fileId
        })
        
        return copiedFile
    }
}

export default GDrive