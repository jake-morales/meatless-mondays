const drive = require('../../helpers/googledrive')
const parseFile = require('../../helpers/parseFile')
const fs = require('fs');

// Run functions locally: (Don't forget to set env vars)
// netlify dev

const fileData = `
<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" href="/assets/success.css">
  <link rel="stylesheet" href="/assets/bulma.css">
  <link rel="stylesheet" href="/assets/css/fontawesome.min.css">
  <link rel="stylesheet" href="/assets/css/solid.min.css">
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dining Hall Recall Study</title>
</head>

<body>
  <div class="container p-2 has-text-centered">
    <h1 class="is-size-1">Completed!</h1>
    <div>
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
      </svg>
    </div>
    <h4 class="is-size-4">You are now automatically entered into the raffle. Thank you for your response.</h3>
  </div>
</body>

</html>
`

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
    // Idea: Add a link with ID to the image in Google Drive
    // Example Link structure: https://drive.google.com/file/d/1oBblLrtb6wq9BU2QEBUrMwOCjpsV_HLZ/view?usp=sharing

    await drive.addData(fields, datetime)

    return {
      statusCode: 200,
      body: fileData,
    }
  } catch (error) {
    if (error.response.data.error_description){
      return { statusCode: 500, body: error.response.data.error_description }
    } else {
      return { statusCode: 500, body: error.toString() }
    }
  }
}

module.exports = { handler }
