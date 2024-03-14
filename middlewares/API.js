module.exports = {
  checkAPI: (req, res, next) => {
    const apiKey = req.headers["x-api-key"]; // Assuming the API key is passed in the "x-api-key" header

    // Check if the API key is valid
    if (apiKey === process.env.API_KEY) {
      // API key is valid
      next();
    } else {
      // API key is invalid
      return res.status(401).json({
        error: "Invalid API key",
      });
    }
  },
};
