/**
 * Badge Model definition
 */

class BadgeModel {
  static createSchema({ id, name, description, icon, category = 'General' }) {
    return {
      id,
      name,
      description,
      icon,
      category
    };
  }
}

module.exports = BadgeModel;
