const buildAccountFactory = require('./account.factory');
const buildSurveyFactory = require('./survey.factory');

const factoryDefaultOptions = {
  _id: { skip: true },
  __v: { skip: true },
  createdAt: { skip: true },
  updatedAt: { skip: true },
};

module.exports = {
  accountFactory: buildAccountFactory(factoryDefaultOptions),
  surveyFactory: buildSurveyFactory(factoryDefaultOptions),
};
