const { factory } = require('fakingoose');
const { faker } = require('@faker-js/faker');

const { Survey } = require('../models');

const factoryOptions = {
  reference: { skip: true },
  fullName: {
    value() {
      return faker.person.fullName();
    },
  },
  streetNumber: {
    value() {
      return faker.number.int({ min: 1, max: 100 });
    },
  },
  streetName: {
    value() {
      return faker.location.street();
    },
  },
  city: {
    value() {
      return faker.location.city();
    },
  },
  postalCode: {
    value() {
      return faker.location.zipCode();
    },
  },
  country: {
    value() {
      return faker.location.country();
    },
  },
  occupants: { skip: true },
  householdSituation: { skip: true },
  mprProfile: { skip: true },
  livingSpaceArea: {
    value() {
      return faker.number.float({ min: 50, max: 200 });
    },
  },
  loftArea: {
    value() {
      return faker.number.float({ min: 50, max: 200 });
    },
  },
  jointOwnersCount: {
    value() {
      return faker.number.int({ min: 1, max: 2 });
    },
  },
  radiatorsCount: {
    value() {
      return faker.number.int({ min: 1, max: 5 });
    },
  },
  phone: {
    value() {
      return faker.phone.number();
    },
  },
  comments: {
    value() {
      return faker.lorem.paragraphs();
    },
  },
  loftComments: {
    value() {
      return faker.lorem.paragraphs();
    },
  },
};

module.exports = function buildSurveyFactory(defaultOptions = {}) {
  function generateSurvey(data = {}, options = {}) {
    return Object.assign(factory(Survey, { ...defaultOptions, ...factoryOptions, ...options }).generate(), data);
  }

  async function createSurvey(data = {}, options = {}) {
    const survey = new Survey(generateSurvey(data, options));

    return survey.save();
  }

  return { generateSurvey, createSurvey };
};
