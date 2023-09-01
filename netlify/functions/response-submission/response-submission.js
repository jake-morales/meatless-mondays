const drive = require('../../helpers/googledrive')
const parseFile = require('../../helpers/parseFile')

// Run functions locally: (Don't forget to set env vars)
// netlify dev

const handler = async (event) => {

  try {
    const fields = await parseFile.parseMultipartForm(event)
    
    var datetime = new Date();
    const fileName = fields['uscEmail']
      + "-"
      + datetime.toLocaleDateString("en-US", {timeZone: "America/Los_Angeles"})
      + "-"
      + datetime.toLocaleTimeString("en-US", {timeZone: "America/Los_Angeles"})

    const id = await drive.uploadFile(fileName, fields['picPlate'].content)

    await drive.addData(fields, datetime)

    return {
      statusCode: 200,
      body: "Submitted. Thank you!",
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
