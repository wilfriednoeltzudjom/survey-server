const { Account } = require('../../database/models');
const { isNonEmptyObject, toLowerCase } = require('../../application/_helpers/dataValidator.helper');
const { BadRequestError } = require('../../application/_helpers/errors');
const MESSAGES = require('../../application/messages');

module.exports = function buildCreateAccount(dependencies) {
  const { securityUtilities } = dependencies;

  async function execute({ lastName, firstName, email, password, role, deletable = true }, { user }) {
    const account = new Account({ lastName, firstName, email, password, role, createdBy: user.id, deletable });
    await account.validate();
    await ensureAccountDoesNotExist(account);
    await encodeAccountPassword(account);

    return account.save();
  }

  async function ensureAccountDoesNotExist({ email }) {
    const account = await Account.findOne({ email: toLowerCase(email), deleted: false });
    if (isNonEmptyObject(account)) throw new BadRequestError(MESSAGES.ALREADY_EXISTING_ACCOUNT({ email }));
  }

  async function encodeAccountPassword(account) {
    account.password = await securityUtilities.createHash(account.password);
  }

  return { execute };
};
