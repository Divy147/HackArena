/**
 * Error Handling Middleware (404 and Global Error Handler)
 */
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Handle 404 Unknown Routes
 */
const notFoundHandler = (req, res, next) => {
  return ApiResponse.error(res, `Route not found - ${req.originalUrl}`, 404);
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled Application Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return ApiResponse.error(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null
  );
};

module.exports = {
  notFoundHandler,
  errorHandler
};
