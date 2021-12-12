const AWS = require("aws-sdk")
const s3 = new AWS.S3()


const BUCKET_NAME = process.env.FILE_UPLOAD_BUCKET_NAME;

module.exports.handler = async(event) => {
    console.log(event)

    const response = {
        isBase64Encoded: false,
        statusCode: 201,
        body: JSON.stringify({message: "Successfully uploaded file to S3"})
    }

    try {
        const base64File = event.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""),"base64")

        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${new Date().toISOString}.png`,
            Body: decodedFile,
            ContentType: "image/png"
        }

        const uploadResult = await s3.upload(params).promise()

        response.body = JSON.stringify({message: "Successfully uploaded file to S3",uploadResult})
    }catch(e){
        console.error(e)
        response.body = JSON.stringify({message: "File failed to upload",errorMessage: e})
        response.statusCode = 500;
    }

    return response;
}