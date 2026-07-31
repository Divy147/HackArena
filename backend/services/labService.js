/**
 * Lab system service for flag verification and progress recording
 */
const FirebaseService = require('./firebaseService');
const GeminiService = require('./geminiService');
const BadgeService = require('./badgeService');
const UserModel = require('../models/userModel');
const ProgressModel = require('../models/progressModel');
const LeaderboardModel = require('../models/leaderboardModel');
const LabModel = require('../models/labModel');
const logger = require('../utils/logger');

class LabService {
  /**
   * Get public list of all labs
   */
  static getLabs() {
    const rawLabs = FirebaseService.getAllLabs();
    return rawLabs.map(lab => LabModel.toClientView(lab));
  }

  /**
   * Get single lab by ID (sanitized)
   * @param {string} labId 
   */
  static getLabById(labId) {
    const rawLab = FirebaseService.getLabById(labId);
    if (!rawLab) return null;
    return LabModel.toClientView(rawLab);
  }

  /**
   * Submit and validate flag for a lab
   * @param {Object} user Current authenticated user
   * @param {string} labId ID of the lab
   * @param {string} submittedFlag Submitted flag string
   */
  static async submitFlag(user, labId, submittedFlag) {
    const lab = FirebaseService.getLabById(labId);
    if (!lab) {
      return { success: false, status: 404, message: 'Lab challenge not found.' };
    }

    const trimmedFlag = (submittedFlag || '').trim();

    // Check if flag is correct
    if (trimmedFlag !== lab.correctFlag) {
      return {
        success: false,
        status: 400,
        message: 'Incorrect flag! Keep analyzing the challenge vector and try again.'
      };
    }

    // Check if lab was already completed
    const alreadyCompleted = (user.completedLabs || []).includes(lab.id);
    let xpGained = 0;
    
    if (!alreadyCompleted) {
      xpGained = lab.xp;
      user.completedLabs = [...(user.completedLabs || []), lab.id];
      user.xp = (user.xp || 0) + xpGained;
      user.level = UserModel.calculateLevel(user.xp);

      // Save user updates
      await FirebaseService.saveUser(user.uid, {
        completedLabs: user.completedLabs,
        xp: user.xp,
        level: user.level
      });
    }

    // Evaluate and unlock badges
    const { updatedUser, newBadges } = await BadgeService.evaluateBadges(user, lab.id);

    // Record progress entry
    const progressEntry = ProgressModel.createSchema({
      userId: user.uid,
      labName: lab.title,
      flag: trimmedFlag,
      status: 'COMPLETED'
    });
    await FirebaseService.saveProgress(progressEntry);

    // Record/Update Leaderboard entry
    const leaderboardEntry = LeaderboardModel.createSchema({
      userId: user.uid,
      username: user.name || user.email.split('@')[0],
      xp: updatedUser.xp
    });
    await FirebaseService.saveLeaderboardEntry(user.uid, leaderboardEntry);

    // Generate AI post-challenge educational explanation
    const aiExplanation = await GeminiService.generateLabExplanation(lab);

    logger.info(`User ${user.uid} successfully completed lab ${lab.id}. XP Gained: ${xpGained}. Total XP: ${updatedUser.xp}`);

    return {
      success: true,
      status: 200,
      message: alreadyCompleted 
        ? 'Correct flag! (Note: You already earned XP for completing this lab earlier).'
        : `Flag Verified! Excellent work! You earned +${xpGained} XP!`,
      data: {
        labId: lab.id,
        labTitle: lab.title,
        xpGained,
        totalXp: updatedUser.xp,
        level: updatedUser.level,
        alreadyCompleted,
        newBadges,
        aiExplanation
      }
    };
  }
}

module.exports = LabService;
