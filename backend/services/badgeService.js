/**
 * Badge evaluation and unlocking service
 */
const FirebaseService = require('./firebaseService');
const UserModel = require('../models/userModel');
const logger = require('../utils/logger');

class BadgeService {
  /**
   * Evaluate user progress and automatically grant qualified badges
   * @param {Object} user 
   * @param {string} justCompletedLabId 
   * @returns {Promise<{ updatedUser: Object, newBadges: Array }>}
   */
  static async evaluateBadges(user, justCompletedLabId) {
    const currentBadges = new Set(user.badges || []);
    const completedLabs = new Set(user.completedLabs || []);
    const newlyUnlocked = [];

    // Rule 1: Cyber Rookie - Awarded on completing 1st lab
    if (completedLabs.size >= 1 && !currentBadges.has('cyber-rookie')) {
      currentBadges.add('cyber-rookie');
      newlyUnlocked.push({ id: 'cyber-rookie', name: 'Cyber Rookie', icon: '🛡️' });
    }

    // Rule 2: SQL Beginner - Awarded on sql-injection lab
    if ((completedLabs.has('sql-injection') || justCompletedLabId === 'sql-injection') && !currentBadges.has('sql-beginner')) {
      currentBadges.add('sql-beginner');
      newlyUnlocked.push({ id: 'sql-beginner', name: 'SQL Beginner', icon: '💉' });
    }

    // Rule 3: XSS Hunter - Awarded on xss lab
    if ((completedLabs.has('xss') || justCompletedLabId === 'xss') && !currentBadges.has('xss-hunter')) {
      currentBadges.add('xss-hunter');
      newlyUnlocked.push({ id: 'xss-hunter', name: 'XSS Hunter', icon: '🏹' });
    }

    // Rule 4: Authentication Expert - Awarded on broken-authentication lab
    if ((completedLabs.has('broken-authentication') || justCompletedLabId === 'broken-authentication') && !currentBadges.has('auth-expert')) {
      currentBadges.add('auth-expert');
      newlyUnlocked.push({ id: 'auth-expert', name: 'Authentication Expert', icon: '🔑' });
    }

    if (newlyUnlocked.length > 0) {
      const updatedBadgeArray = Array.from(currentBadges);
      user.badges = updatedBadgeArray;
      await FirebaseService.saveUser(user.uid, { badges: updatedBadgeArray });
      logger.info(`Unlocked ${newlyUnlocked.length} new badges for user ${user.uid}:`, newlyUnlocked.map(b => b.name));
    }

    return {
      updatedUser: user,
      newBadges: newlyUnlocked
    };
  }

  /**
   * Return list of all available badges with user's unlocked status
   * @param {Object} user 
   */
  static getUserBadgesStatus(user) {
    const allBadges = FirebaseService.getAllBadges();
    const userBadgeSet = new Set(user ? user.badges || [] : []);

    return allBadges.map(badge => ({
      ...badge,
      unlocked: userBadgeSet.has(badge.id)
    }));
  }
}

module.exports = BadgeService;
