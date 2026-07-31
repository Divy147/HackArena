/**
 * User Model definition and schemas
 */

class UserModel {
  /**
   * Create a new User object schema
   * @param {Object} data User attributes
   * @returns {Object} User schema instance
   */
  static createSchema({ uid, name, email, passwordHash = null, xp = 0, level = 1, completedLabs = [], badges = [], createdAt = null }) {
    return {
      uid,
      name,
      email,
      ...(passwordHash ? { passwordHash } : {}),
      xp: Number(xp) || 0,
      level: Number(level) || 1,
      completedLabs: Array.isArray(completedLabs) ? completedLabs : [],
      badges: Array.isArray(badges) ? badges : [],
      createdAt: createdAt || new Date().toISOString()
    };
  }

  /**
   * Calculate User Level based on XP
   * Formula: Level = Math.floor(XP / 100) + 1
   * @param {number} xp 
   * @returns {number}
   */
  static calculateLevel(xp) {
    const currentXp = Number(xp) || 0;
    return Math.floor(currentXp / 100) + 1;
  }

  /**
   * Sanitize user object for client response (remove password hash)
   * @param {Object} user 
   * @returns {Object}
   */
  static toPublicProfile(user) {
    if (!user) return null;
    const { passwordHash, ...publicProfile } = user;
    return publicProfile;
  }
}

module.exports = UserModel;
