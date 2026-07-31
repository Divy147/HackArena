/**
 * Leaderboard Controller - Rankings and XP metrics
 */
const FirebaseService = require('../services/firebaseService');
const ApiResponse = require('../utils/apiResponse');

class LeaderboardController {
  /**
   * GET /api/leaderboard
   * Get global user leaderboard sorted by XP descending
   */
  static async getLeaderboard(req, res, next) {
    try {
      const leaderboard = await FirebaseService.getLeaderboard();
      return ApiResponse.success(res, 'Leaderboard retrieved successfully.', leaderboard);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LeaderboardController;
