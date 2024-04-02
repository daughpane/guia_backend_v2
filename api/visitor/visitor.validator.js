const { query, body } = require('express-validator');

const getArtworkVisitsPerSectionIdValidator = [
    query('section_id')
        .notEmpty().withMessage('Section ID is required.')
        .isInt({ min: 1 }).withMessage('Section ID is invalid.'),
    query('visitor_token')
        .notEmpty().withMessage('Visitor token is required.')
]

module.exports = {
    getArtworkVisitsPerSectionIdValidator,
}