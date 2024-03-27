const { body } = require('express-validator');

const adminLoginValidator = [
  // Check if admin_username is present and not empty
  body('admin_username').notEmpty().withMessage('Admin username is required'),

  // Check if admin_password is present and not empty
  body('admin_password').notEmpty().withMessage('Admin password is required')
];

module.exports = {
  adminLoginValidator
}