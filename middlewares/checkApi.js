const checkAPI = (req, res, next) => {
    const apiKey = req.headers["x-api-key"]; 
    // Check if the API key is valid
    if (apiKey === process.env.API_KEY) {
      next();
    } else {
      return res.status(401).json({
        error: "Invalid API key",
      });
    }
  }

module.exports = {
  checkAPI
};
