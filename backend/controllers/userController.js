/**
 * User Controller - Profile management
 */
const FirebaseService = require('../services/firebaseService');
const UserModel = require('../models/userModel');
const ApiResponse = require('../utils/apiResponse');

class UserController {
  /**
   * GET /api/user/profile
   * Returns current authenticated user profile + progress stats + rank
   */
  static async getProfile(req, res, next) {
    try {
      const user = req.user;
      const progress = await FirebaseService.getUserProgress(user.uid);
      const leaderboard = await FirebaseService.getLeaderboard();

      // Find user rank
      const userRankEntry = leaderboard.find(e => e.userId === user.uid);
      const rank = userRankEntry ? userRankEntry.rank : 'N/A';

      const publicProfile = UserModel.toPublicProfile(user);

      return ApiResponse.success(res, 'User profile retrieved successfully.', {
        ...publicProfile,
        rank,
        progressHistory: progress
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/user/update
   * Updates profile fields
   */
  static async updateProfile(req, res, next) {
    try {
      const user = req.user;
      const { name } = req.body;

      const updates = {};
      if (name) updates.name = name;

      const updatedUser = await FirebaseService.saveUser(user.uid, updates);

      // Update leaderboard entry if username changed
      if (name) {
        await FirebaseService.saveLeaderboardEntry(user.uid, {
          username: name
        });
      }

      return ApiResponse.success(
        res,
        'Profile updated successfully.',
        UserModel.toPublicProfile(updatedUser)
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
