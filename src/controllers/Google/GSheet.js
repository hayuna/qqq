import { google } from 'googleapis'
const sheets = google.sheets("v4")
import config from './config.js'
import auth from './auth.js'
import { Console } from '../../utils.js'

const GSheet = {
    async getProtectedRangeIds({ fileId }) {
        const response = await sheets.spreadsheets.get({
            spreadsheetId: fileId,
            ranges: [],
            includeGridData: false,
            auth
        })
        const protectedRangeIds = response.data.sheets
            .filter((s) => Boolean(s.protectedRanges))
            .map((s) => s.protectedRanges[0].protectedRangeId)
        return protectedRangeIds
    },

    async addPermissionsToProtectedCells({ fileId, emails }) {
        const protectedRangeIds = await this.getProtectedRangeIds({ fileId })
        Console.log({protectedRangeIds, emails})
        const requests = protectedRangeIds.map((protectedRangeId) => {
            return {
                updateProtectedRange: {
                    protectedRange: {
                        editors: {
                            users: [...emails, config.GOOGLE_SERVICE_ACCOUNT_EMAIL]
                        },
                        protectedRangeId
                    },
                    fields: '*'
                }
            }
        })
        const x = await sheets.spreadsheets.batchUpdate({
            auth,
            spreadsheetId: fileId,
            resource: {
                requests
            }
        })
    },

    async replaceCells({ fileId, country }) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: fileId,
            range: "CreateGroup!C2",
            requestBody: {
                values: [[country.fullname]]
            },
            valueInputOption: 'RAW',
            auth
        })
        await sheets.spreadsheets.values.update({
            spreadsheetId: fileId,
            range: "CreateGroup!C4",
            requestBody: {
                values: [[country.ISOCode]]
            },
            valueInputOption: 'RAW',
            auth
        })
    },

    async addSheetToList({fileId, country}){
        await sheets.spreadsheets.values.append({
            spreadsheetId: config.LIST,
            range: `${_.capitalize(environment)}!A:C`,
            valueInputOption: "RAW",
            requestBody: {
                values: [
                    [
                        country.fullname,
                        country.ISOCode,
                        `https://docs.google.com/spreadsheets/d/${fileId}/edit#gid=627292782`
                    ]
                ]
            },
            auth
        })
    },

    async getDevelopers(){
        const developers = await sheets.spreadsheets.values.get({
            spreadsheetId: config.LIST,
            range: "Developers!A:A",
            auth,
        })
        return developers.data.values.flat()
    }
}

export default GSheet
