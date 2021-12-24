import { google } from 'googleapis';
import config from './config.js';
const drive = google.drive('v3')
import auth from './auth.js'

const GDrive = {
    async getFiles(){
        const filesDEV = await drive.files.list({
            auth,
            q: `not trashed and parents= '${config.DEV}'`,
            fields: ['files(id, name)'],
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            corpora: 'drive',
            driveId: config.SHARED_DRIVE,
            includeTeamDriveItems: true,
            pageSize: 300
        })
        // console.log(filesDEV.data.files)
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
        console.log({newFolder:newFolder.data })
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
        console.log({renamedFile:renamedFile.data })
        return renamedFile
    },

    async makeACopy({fileId}) {
        const copiedFile = await drive.files.copy({
            auth,
            supportsAllDrives: true,
            fileId
        })
        console.log({copiedFile:copiedFile.data })
        
        return copiedFile
    }
}

export default GDrive