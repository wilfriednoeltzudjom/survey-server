const accountHelper = require('../../application/_helpers/account.helper');
const { assignSafeDeleteParams } = require('../../application/_helpers/entities.helper');
const { BadRequestError } = require('../../application/_helpers/errors');
const MESSAGES = require('../../application/messages');
const { Survey } = require('../../database/models');

module.exports = function buildDeleteAccount() {
  async function execute({ accountId }, { user }) {
    const account = await accountHelper.findAccountById(accountId);
    await ensureAccountIsDeletable(account);
    assignSafeDeleteParams(account, user);

    return account.save();
  }

  async function ensureAccountIsDeletable(account) {
    const surveysCount = await Survey.countDocuments({ deleted: false, createdBy: account.id });
    if (surveysCount > 0) throw new BadRequestError(MESSAGES.ACCOUNT_NON_DELETABLE_EXISTING_SURVEYS);
  }

  return { execute };
};
