const { query, body } = require('express-validator');
const { visitType } = require('../../utils/functions')
const getArtworkVisitsPerSectionIdValidator = [
    query('section_id')
        .notEmpty().withMessage('Section ID is required.')
        .isInt({ min: 1 }).withMessage('Section ID is invalid.'),
    query('visitor_token')
        .notEmpty().withMessage('Visitor token is required.')
]

const editArtworkChecklistPerVisitorValidator = [
  body('art_id')
    .trim().notEmpty().withMessage('Art ID is required.')
    .isInt({ min: 1 }).withMessage('Art ID is invalid.'),
  body('visitor_token')
    .trim().notEmpty().withMessage('Visitor token is required.'),
  body('is_visited')
    .trim().notEmpty().withMessage('is_visited is required.')
    .isBoolean().withMessage('is_visited only accepts boolean value.'),
  body('visit_type')
    .trim().notEmpty().withMessage('Visit type is required.')
    .custom(visitType).withMessage('visit_type only accepts scan or manual')
  
]

module.exports = {
  getArtworkVisitsPerSectionIdValidator,
  editArtworkChecklistPerVisitorValidator
}