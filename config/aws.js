const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

const config = process.env;

AWS.config.update({
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

module.exports = s3;
