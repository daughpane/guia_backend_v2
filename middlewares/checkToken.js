const { decodeToken, getTokenExpiry } = require("../utils/token")
const { isDatetimePassed } = require("../utils/functions")

const checkToken = (req, res, next) => {
  const auth = req.headers["authorization"]
  if (!auth) {
    return res.status(401).send({detail:"Authorization required."})
  }
  const parts = auth.split(' ');
  if (parts.length === 2 && parts[0] === 'Token') {
    var token = parts[1]
    try {
      var decodedToken = decodeToken(token);
      var expiry = getTokenExpiry(token)
      if (isDatetimePassed(expiry)) {
        return res.status(401).send({detail:"Token is expired. Please login again."})
      }
      req.admin_id = decodedToken.admin_id
      req.museum_id = decodedToken.museum_id

    } catch (err) {
      return res.status(401).send({detail:"Token is expired. Please login again."})
    }
    
  } else {
    return res.status(401).send({detail:"Invalid authorization token."})
  }
  
  next()
}

module.exports = {
  checkToken
}