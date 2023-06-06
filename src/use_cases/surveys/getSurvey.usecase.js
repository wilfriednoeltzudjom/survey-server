const surveyHelper = require('../../application/_helpers/survey.helper');

module.exports = function buildGetSurvey() {
  async function execute({ surveyId }) {
    return surveyHelper.findSurveyById(surveyId);
  }

  return { execute };
};
