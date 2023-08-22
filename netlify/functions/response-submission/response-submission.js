import busboy from 'busboy';

// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
const handler = async (event) => {
  try {
    const fields = await parseMultipartForm(event)

    return {
      statusCode: 200,
      body: JSON.stringify(fields),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

function parseMultipartForm(event) {
  return new Promise((resolve) => {
    // we'll store all form fields inside of this
    const fields = {};

    // let's instantiate our busboy instance!
    const bb = busboy({ headers: event.headers });

    // before parsing anything, we need to set up some handlers.
    // whenever busboy comes across a file ...
    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      file.on('data', (data) => {
        fields[name] = {
          filename,
          type: mimeType,
          content: data,
        };
      })
    });
    // whenever busboy comes across a normal field ...
    bb.on('field', (name, val, info) => {
      fields[name] = val
    });

    // once busboy is finished, we resolve the promise with the resulted fields.
    bb.on("close", () => {
      resolve(fields)
    });

    // now that all handlers are set up, we can finally start processing our request!
    bb.end(Buffer.from(event.body, 'base64'))
  });
}
