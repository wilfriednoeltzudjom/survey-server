const { Account } = require('../../database/models');
const MESSAGES = require('../../application/messages');
const { isNullishOrEmpty, toLowerCase } = require('../../application/_helpers/dataValidator.helper');
const { ResourceNotFoundError, BadRequestError } = require('../../application/_helpers/errors');

module.exports = function buildSignUp(dependencies) {
  const { securityUtilities } = dependencies;

  async function execute({ email, password }) {
    const account = await findAccountByEmail(email);
    await ensurePasswordIsCorrect(account, password);

    return createSignInResponse(account);
  }

  async function findAccountByEmail(email) {
    const account = await Account.findOne({ email: toLowerCase(email), deleted: false });
    if (isNullishOrEmpty(account)) throw new ResourceNotFoundError(MESSAGES.ACCOUNT_NOT_FOUND({ email }));

    return account;
  }

  async function ensurePasswordIsCorrect(account, password) {
    const samePassword = await securityUtilities.compare(password, account.password);
    if (!samePassword) throw new BadRequestError(MESSAGES.INCORRECT_PASSWORD(account));
  }

  async function createSignInResponse(account) {
    const token = securityUtilities.generateToken({ id: account.id, email: account.email, role: account.role });

    return { account, token };
  }

  return { execute };
};
