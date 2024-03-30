const { validationResult } = require("express-validator")

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg).join('. ');
        return res.status(400).send({ detail: errorMessages });
    }
    next(); // Continue to the next middleware or route handler
};

module.exports = {
  handleValidationErrors
};
