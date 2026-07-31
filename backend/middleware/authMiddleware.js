/**
 * JWT Authentication Middleware
 */
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const FirebaseService = require('../services/firebaseService');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return ApiResponse.error(res, 'Access denied. No authentication token provided.', 401);
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      const user = await FirebaseService.getUserById(decoded.uid);

      if (!user) {
        return ApiResponse.error(res, 'Authentication failed. User account not found or deactivated.', 401);
      }

      req.user = user;
      next();
    } catch (err) {
      logger.warn('JWT verification failed:', err.message);
      return ApiResponse.error(res, 'Invalid or expired authentication token.', 401);
    }
  } catch (error) {
    logger.error('Error in authMiddleware:', error.message);
    return ApiResponse.error(res, 'Internal server authentication error.', 500);
  }
};

module.exports = {
  protect
};
