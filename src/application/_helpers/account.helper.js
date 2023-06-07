const { Account } = require('../../database/models');
const MESSAGES = require('../messages');
const { isNullishOrEmpty } = require('./dataValidator.helper');
const { ResourceNotFoundError } = require('./errors');

async function findAccountById(accountId) {
  const account = await Account.findById({ _id: accountId, deleted: false });
  if (isNullishOrEmpty(account)) throw new ResourceNotFoundError(MESSAGES.ACCOUNT_NOT_FOUND({ accountId }));

  return account;
}

module.exports = { findAccountById };
