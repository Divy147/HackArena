/**
 * Firebase Firestore Service with local memory fallback wrapper
 */
const { db, isLocalFallback } = require('../config/firebase');
const logger = require('../utils/logger');
const { SEED_LABS, SEED_BADGES } = require('../utils/seedData');

// In-Memory storage for local fallback mode
const memoryStore = {
  users: new Map(),
  progress: [],
  leaderboard: new Map(),
  labs: new Map(SEED_LABS.map(lab => [lab.id, lab])),
  badges: new Map(SEED_BADGES.map(badge => [badge.id, badge]))
};

class FirebaseService {
  /**
   * Save or update user document
   * @param {string} uid 
   * @param {Object} userData 
   */
  static async saveUser(uid, userData) {
    if (!isLocalFallback && db) {
      try {
        await db.collection('Users').doc(uid).set(userData, { merge: true });
        return userData;
      } catch (err) {
        logger.error(`Firestore saveUser error for uid ${uid}:`, err.message);
      }
    }
    
    // Fallback store
    const existing = memoryStore.users.get(uid) || {};
    const updated = { ...existing, ...userData };
    memoryStore.users.set(uid, updated);
    return updated;
  }

  /**
   * Get user document by UID
   * @param {string} uid 
   */
  static async getUserById(uid) {
    if (!isLocalFallback && db) {
      try {
        const doc = await db.collection('Users').doc(uid).get();
        if (doc.exists) {
          return doc.data();
        }
        return null;
      } catch (err) {
        logger.error(`Firestore getUserById error for uid ${uid}:`, err.message);
      }
    }
    
    return memoryStore.users.get(uid) || null;
  }

  /**
   * Get user document by email
   * @param {string} email 
   */
  static async getUserByEmail(email) {
    if (!isLocalFallback && db) {
      try {
        const snapshot = await db.collection('Users').where('email', '==', email.toLowerCase()).limit(1).get();
        if (!snapshot.empty) {
          return snapshot.docs[0].data();
        }
        return null;
      } catch (err) {
        logger.error(`Firestore getUserByEmail error for ${email}:`, err.message);
      }
    }

    const lowerEmail = email.toLowerCase();
    for (const user of memoryStore.users.values()) {
      if (user.email && user.email.toLowerCase() === lowerEmail) {
        return user;
      }
    }
    return null;
  }

  /**
   * Add a progress record
   * @param {Object} progressData 
   */
  static async saveProgress(progressData) {
    if (!isLocalFallback && db) {
      try {
        await db.collection('Progress').add(progressData);
        return progressData;
      } catch (err) {
        logger.error('Firestore saveProgress error:', err.message);
      }
    }

    memoryStore.progress.push(progressData);
    return progressData;
  }

  /**
   * Get user progress records
   * @param {string} userId 
   */
  static async getUserProgress(userId) {
    if (!isLocalFallback && db) {
      try {
        const snapshot = await db.collection('Progress').where('userId', '==', userId).get();
        return snapshot.docs.map(doc => doc.data());
      } catch (err) {
        logger.error(`Firestore getUserProgress error for userId ${userId}:`, err.message);
      }
    }

    return memoryStore.progress.filter(p => p.userId === userId);
  }

  /**
   * Save or update leaderboard entry
   * @param {string} userId 
   * @param {Object} leaderboardData 
   */
  static async saveLeaderboardEntry(userId, leaderboardData) {
    if (!isLocalFallback && db) {
      try {
        await db.collection('Leaderboard').doc(userId).set(leaderboardData, { merge: true });
        return leaderboardData;
      } catch (err) {
        logger.error(`Firestore saveLeaderboardEntry error for userId ${userId}:`, err.message);
      }
    }

    memoryStore.leaderboard.set(userId, leaderboardData);
    return leaderboardData;
  }

  /**
   * Get full leaderboard sorted by XP descending
   */
  static async getLeaderboard() {
    if (!isLocalFallback && db) {
      try {
        const snapshot = await db.collection('Leaderboard').orderBy('xp', 'desc').get();
        const entries = snapshot.docs.map(doc => doc.data());
        return entries.map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));
      } catch (err) {
        logger.error('Firestore getLeaderboard error:', err.message);
      }
    }

    // Local fallback sorting
    const entries = Array.from(memoryStore.leaderboard.values());
    entries.sort((a, b) => b.xp - a.xp);
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }

  /**
   * Get lab by ID
   * @param {string} labId 
   */
  static getLabById(labId) {
    return memoryStore.labs.get(labId) || null;
  }

  /**
   * Get all labs
   */
  static getAllLabs() {
    return Array.from(memoryStore.labs.values());
  }

  /**
   * Get all badge definitions
   */
  static getAllBadges() {
    return Array.from(memoryStore.badges.values());
  }
}

module.exports = FirebaseService;
