/**
 * AI Routes (/api/ai)
 */
const express = require('express');
const router = express.Router();
const AiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { aiChatValidation } = require('../middleware/validationMiddleware');
const { aiRateLimiter } = require('../middleware/rateLimiter');

router.post('/chat', protect, aiRateLimiter, aiChatValidation, AiController.chat);

module.exports = router;
