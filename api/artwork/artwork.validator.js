const { query, body } = require('express-validator');

const {
  greaterThanZero,
  validateImagesLength,
  thumbnailInImages
} = require("../../utils/functions")

const getArtworkByArtIdAdminIdValidator = [
  query('art_id').notEmpty().withMessage('Artwork ID is required.')
]

const editArtworkValidator = [
  body('art_id')
    .trim().notEmpty().withMessage('Art ID is required.')
    .isInt({ min: 1 }).withMessage('Art ID is invalid.'),
  body('section_id')
    .trim().notEmpty().withMessage('Section ID is required.')
    .isInt({ min: 1 }).withMessage('Section ID is invalid.'),
  body('title')
    .trim().notEmpty().withMessage('Title is required.'),
  body('artist_name')
    .trim().notEmpty().withMessage('Artist name is required.'),
  body('medium')
    .trim().notEmpty().withMessage('Medium is required.'),
  body('date_published')
    .trim().notEmpty().withMessage('Date published is required.'),
  body('dimen_width_cm')
    .notEmpty().withMessage('Width is required.')
    .isDecimal({ min: 0 }).withMessage('Width must be a decimal greater than zero.'),
  body('dimen_length_cm')
    .notEmpty().withMessage('Length is required.')
    .isDecimal().custom(greaterThanZero).withMessage('Length must be a decimal greater than zero.'),
  body('dimen_height_cm')
    .optional({ nullable: true })
    .isDecimal().custom(greaterThanZero).withMessage('Height must be a decimal greater than zero.'),
  body('description')
    .trim().notEmpty().withMessage('Description is required.'),
  body('additional_info')
    .optional({ nullable: true }),
  body('updated_by')
    .trim().notEmpty().withMessage('Updated by is required.')
    .isInt({ min: 1 }).withMessage('Updated by is invalid.'),
  body('images')
    .isArray().custom(validateImagesLength).withMessage('10 artwork images are required.'),
  body('thumbnail')
    .trim().notEmpty().withMessage('Thumbnail is required.')
    .custom((value, { req }) => thumbnailInImages(value, { req })).withMessage('Thumbnail should be one of the images.'),
]

module.exports = {
  getArtworkByArtIdAdminIdValidator,
  editArtworkValidator
}