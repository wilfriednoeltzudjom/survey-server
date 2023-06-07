const accountHelper = require('../../application/_helpers/account.helper');
const { assignSafeDeleteParams } = require('../../application/_helpers/entities.helper');

module.exports = function buildDeleteAccount() {
  async function execute({ accountId }, { user }) {
    const account = await accountHelper.findAccountById(accountId);
    assignSafeDeleteParams(account, user);

    return account.save();
  }

  return { execute };
};
