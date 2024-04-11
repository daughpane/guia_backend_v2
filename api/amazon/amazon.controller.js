const AWS = require('aws-sdk');
const { getS3Credentials } = require("../../utils/amazon")

const getS3CredentialController = async (req, res) => {
  const image_name = req.body.image_name;

  if (!image_name) {
    return res.status(500).send({detail: "Image name is required."})
  }

  // Generate the presigned URL
  const image_ext = image_name.split('.').pop();

  if (image_ext !== 'jpeg' && image_ext !== 'jpg') {
    return res.status(403).send({
      detail: 'Only JPEG files are allowed.',
    });
  }

  try {
    const credential =  getS3Credentials(image_name)
    return res.status(200).send({upload_url: credential})
  } catch (err) {
    console.error(err)
    return res.status(500).send({detail: "Internal server error."})
  }
}

module.exports = {
  getS3CredentialController
}