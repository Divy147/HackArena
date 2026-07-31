/**
 * Express Rate Limiting Middleware
 */
const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/apiResponse');

const globalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, 'Too many requests from this IP. Please try again later.', 429);
  }
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 login/signup attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, 'Too many authentication attempts. Please wait 15 minutes before trying again.', 429);
  }
});

const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // 15 AI questions per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(res, 'AI Mentor rate limit exceeded. Please wait a moment before sending more questions.', 429);
  }
});

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  aiRateLimiter
};
