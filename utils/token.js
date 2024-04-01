const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET_KEY
const adminExpiry = process.env.ADMIN_EXPIRES_IN

const generateToken = (payload, expiresIn = adminExpiry) => {
  return jwt.sign(
    payload,
    secretKey,
    { expiresIn }
  )
}

const getTokenExpiry = (token) => {
  try {
      const decodedToken = jwt.verify(token, secretKey);
      if (decodedToken && decodedToken.exp) {
          // Expiration time is in seconds since epoch, convert to milliseconds
          const expirationTimeMillis = decodedToken.exp * 1000;
          return new Date(expirationTimeMillis);
      } else {
          throw new Error('Token expiration time not found.');
      }
  } catch (error) {
      console.error('Error decoding token:', error.message);
      throw new Error('Token cannot be verified.')
  }
}


module.exports = {
  generateToken,
  getTokenExpiry
}