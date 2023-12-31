const { google } = require('googleapis');
const { Readable } = require('stream')

// How to set env vars locally
// netlify env:set CLIENT_ID "..."

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirectUri = 'https://developers.google.com/oauthplayground'
const refreshToken = process.env.REFRESH_TOKEN
const sheetID = process.env.SHEET_ID
const sheetRange = process.env.SHEET_RANGE

const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
)

oauth2Client.setCredentials({refresh_token: refreshToken})

const drive = google.drive({ version: 'v3', auth: oauth2Client });
const sheets = google.sheets({version: 'v4', auth: oauth2Client});

const uploadFile = async function (filename, fileData) {  
    const file = await drive.files.create({
        media: {
            body: Readable.from(fileData)
        },
        fields: 'id',
        requestBody: {
            name: filename,
        },
    });

    return file.data.id
}

const addData = async function (data, datetime) {
    const values = [
        [
            data.uscEmail,
            datetime.toLocaleDateString("en-US", {timeZone: "America/Los_Angeles"}),
            datetime.toLocaleTimeString("en-US", {timeZone: "America/Los_Angeles"}),
            data.hasVegetables,
            data.hasCarbs,
            data.hasBeef,
            data.hasNonBeef,
            data.hasDairy,
            data.hasOtherProteins
        ]
    ]
    const resource = {
        values
    }
    const result = await sheets.spreadsheets.values.append({
        spreadsheetId: sheetID,
        range: sheetRange, // Make sure it matches the top column of spreasheet
        valueInputOption: "USER_ENTERED",
        resource: resource
    });
}

exports.uploadFile = uploadFile
exports.addData = addData