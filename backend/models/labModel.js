/**
 * Lab Model definition
 */

class LabModel {
  static createSchema({ id, title, category, difficulty, xp, correctFlag, badgeId, badgeName, description, instructions, vulnerabilityDetails }) {
    return {
      id,
      title,
      category,
      difficulty,
      xp: Number(xp) || 0,
      correctFlag,
      badgeId,
      badgeName,
      description,
      instructions,
      vulnerabilityDetails
    };
  }

  /**
   * Sanitizes lab object for client view (omits sensitive correctFlag)
   */
  static toClientView(lab) {
    if (!lab) return null;
    const { correctFlag, ...safeLab } = lab;
    return safeLab;
  }
}

module.exports = LabModel;
