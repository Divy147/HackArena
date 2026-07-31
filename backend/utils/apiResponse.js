/**
 * Standardized API Response format helper
 */
class ApiResponse {
  /**
   * Send success response
   * @param {Object} res Express response object
   * @param {string} message Success message
   * @param {Object|Array} data Data payload
   * @param {number} statusCode HTTP status code (default 200)
   */
  static success(res, message = 'Success', data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send error response
   * @param {Object} res Express response object
   * @param {string} message Error message
   * @param {number} statusCode HTTP status code (default 500)
   * @param {Object|Array|null} errors Details of errors (e.g. validation errors)
   */
  static error(res, message = 'Internal Server Error', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = ApiResponse;
