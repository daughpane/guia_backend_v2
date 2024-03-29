const { body, query } = require('express-validator');

const getAllArtworkByAdminIdValidator = [
  query('admin_id').notEmpty().withMessage('Admin ID is required.')
]

const getArtworkByArtIdAdminIdValidator = [
  query('art_id').notEmpty().withMessage('Artwork ID is required.')
]

module.exports = {
  getAllArtworkByAdminIdValidator,
  getArtworkByArtIdAdminIdValidator
}