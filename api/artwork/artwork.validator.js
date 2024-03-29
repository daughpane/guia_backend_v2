const { query } = require('express-validator');

const getArtworkByArtIdAdminIdValidator = [
  query('art_id').notEmpty().withMessage('Artwork ID is required.')
]

module.exports = {
  getArtworkByArtIdAdminIdValidator
}