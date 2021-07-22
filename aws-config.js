const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
AWS.config.apiVersions = {
    sns: "2010-03-31",
};

const sns = new AWS.SNS();

module.exports =  sns;
