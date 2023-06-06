const { ROLES } = require('../../database/enums');
const { Account } = require('../../database/models');

module.exports = function buildGetAccounts() {
  async function execute() {
    return Account.find({ role: { $ne: ROLES.ADMINISTRATOR } });
  }

  return { execute };
};
