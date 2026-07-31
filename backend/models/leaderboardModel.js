/**
 * Leaderboard Model schema
 */

class LeaderboardModel {
  static createSchema({ userId, username, xp, rank = 1 }) {
    return {
      userId,
      username,
      xp: Number(xp) || 0,
      rank: Number(rank) || 1
    };
  }
}

module.exports = LeaderboardModel;
