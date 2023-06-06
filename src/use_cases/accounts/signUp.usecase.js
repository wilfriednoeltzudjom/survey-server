const { Account } = require('../../database/models');

module.exports = function buildSignUp(dependencies) {
  const { securityUtilities } = dependencies;

  async function execute({ lastName, firstName, email, password, role }) {
    const account = new Account({ lastName, firstName, email, password, role });
    await account.validate();
    await encodeAccountPassword(account);

    return account.save();
  }

  async function encodeAccountPassword(account) {
    account.password = await securityUtilities.createHash(account.password);
  }

  return { execute };
};
