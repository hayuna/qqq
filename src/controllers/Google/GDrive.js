import { google } from 'googleapis';
import config from './config.js';
const drive = google.drive('v3')
import auth from './auth.js'

const GDrive = {
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