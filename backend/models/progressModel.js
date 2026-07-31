/**
 * Progress Model schema
 */

class ProgressModel {
  static createSchema({ userId, labName, flag, status = 'COMPLETED', completedAt = null }) {
    return {
      userId,
      labName,
      flag,
      status,
      completedAt: completedAt || new Date().toISOString()
    };
  }
}

module.exports = ProgressModel;
