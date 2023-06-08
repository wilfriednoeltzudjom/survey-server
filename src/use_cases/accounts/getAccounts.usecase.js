const { Account } = require('../../database/models');

module.exports = function buildGetAccounts() {
  async function execute() {
    return Account.find({ deleted: false, deletable: true }).sort({ createdAt: -1 });
  }

  return { execute };
};
