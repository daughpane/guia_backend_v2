const { body } = require('express-validator');

const adminLoginValidator = [
  // Check if admin_username is present and not empty
  body('admin_username').notEmpty().withMessage('Admin username is required.'),

  // Check if admin_password is present and not empty
  body('admin_password').notEmpty().withMessage('Admin password is required.')
];
const adminChangePasswordValidator = [
  body('admin_id').trim().notEmpty().withMessage('Admin ID is required.'),

  body('old_password').trim().notEmpty().withMessage('Admin old password is required.'),

  body('new_password').trim().notEmpty().withMessage('Admin old password is required.'),
];

module.exports = {
  adminLoginValidator,
  adminChangePasswordValidator
}