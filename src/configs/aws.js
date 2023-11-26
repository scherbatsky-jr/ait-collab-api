const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: 'AKIA3QU4BJAWN4BL35LF',
  secretAccessKey: 'Z+IKWKSkSgas/0jQ3xxNeXjDBp8nJ4iGjkg/JVyz',
  region: 'ap-southeast-1', // e.g., us-east-1
});

const s3 = new AWS.S3();

module.exports = s3;
