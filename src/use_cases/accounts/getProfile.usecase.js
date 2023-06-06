const { Account } = require('../../database/models');

module.exports = function buildGetProfile() {
  async function execute({ user }) {
    return Account.findById(user.id);
  }

  return { execute };
};
