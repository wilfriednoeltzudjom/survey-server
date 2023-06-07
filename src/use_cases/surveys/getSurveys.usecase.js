const { Survey } = require('../../database/models');
const { ROLES } = require('../../database/enums');

module.exports = function buildGetSurveys() {
  async function execute({ user }) {
    const query = { deleted: false };
    if (user.role === ROLES.OPERATOR) {
      query.createdBy = user.id;
    }

    return Survey.find(query).sort({ createdAt: -1 }).populate('createdBy');
  }

  return { execute };
};
