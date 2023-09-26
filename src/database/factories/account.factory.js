const { factory } = require('fakingoose');
const { faker } = require('@faker-js/faker');

const { Account } = require('../models');

const factoryOptions = {
  lastName: {
    value() {
      return faker.person.lastName();
    },
  },
  firstName: {
    value() {
      return faker.person.firstName();
    },
  },
  email: {
    value() {
      return faker.internet.email();
    },
  },
  password: {
    value() {
      return faker.internet.password();
    },
  },
};

module.exports = function buildAccountFactory(defaultOptions = {}) {
  function generateAccount(data = {}, options = {}) {
    return Object.assign(factory(Account, { ...defaultOptions, ...factoryOptions, ...options }).generate(), data);
  }

  async function createAccount(data = {}, options = {}) {
    const account = new Account(generateAccount(data, options));

    return account.save();
  }

  return { generateAccount, createAccount };
};
