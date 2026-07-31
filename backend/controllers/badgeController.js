/**
 * Badge Controller - Badges catalog and user status
 */
const BadgeService = require('../services/badgeService');
const ApiResponse = require('../utils/apiResponse');

class BadgeController {
  /**
   * GET /api/badges
   * Get all badges and current user's unlock statuses
   */
  static async getBadges(req, res, next) {
    try {
      const user = req.user;
      const badgesStatus = BadgeService.getUserBadgesStatus(user);
      return ApiResponse.success(res, 'Badges retrieved successfully.', badgesStatus);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BadgeController;
