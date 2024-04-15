const AWS = require('aws-sdk');

const getPresignedUrls = (key, expiresInSeconds = 86400) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: key,
    Expires: expiresInSeconds,
  };

  return s3.getSignedUrlPromise('getObject', params);
};

const getS3Credentials = (image_name, expiresInSeconds = 86400) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: process.env.AWS_STORAGE_BUCKET_NAME,
    Key: "artworks/"+image_name,
    Expires: expiresInSeconds,
    ContentType: 'image/jpeg'
  };

  return s3.getSignedUrl('putObject', params);
};

module.exports = {
  getPresignedUrls,
  getS3Credentials
};
