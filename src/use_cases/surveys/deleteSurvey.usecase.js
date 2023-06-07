const surveyHelper = require('../../application/_helpers/survey.helper');
const { assignSafeDeleteParams } = require('../../application/_helpers/entities.helper');

module.exports = function buildDeleteSurvey() {
  async function execute({ surveyId }, { user }) {
    const survey = await surveyHelper.findSurveyById(surveyId);
    assignSafeDeleteParams(survey, user);

    return survey.save();
  }

  return { execute };
};
