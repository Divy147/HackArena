/**
 * Auth Routes (/api/auth)
 */
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middleware/validationMiddleware');
const { authRateLimiter } = require('../middleware/rateLimiter');

router.post('/signup', authRateLimiter, signupValidation, AuthController.signup);
router.post('/login', authRateLimiter, loginValidation, AuthController.login);

module.exports = router;
