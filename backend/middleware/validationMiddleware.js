/**
 * Input validation and sanitization middleware using express-validator
 */
const { body, validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/**
 * Helper to process validation error results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(
      res,
      'Validation failed. Please correct input fields.',
      422,
      errors.array().map(e => ({ field: e.path, message: e.msg }))
    );
  }
  next();
};

const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const submitFlagValidation = [
  body('labId').trim().notEmpty().withMessage('labId is required'),
  body('flag').trim().notEmpty().withMessage('flag is required'),
  validate
];

const aiChatValidation = [
  body('prompt').trim().notEmpty().withMessage('prompt is required'),
  validate
];

const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  validate
];

module.exports = {
  signupValidation,
  loginValidation,
  submitFlagValidation,
  aiChatValidation,
  updateProfileValidation
};
