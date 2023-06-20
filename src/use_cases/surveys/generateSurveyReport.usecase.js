const surveyHelper = require('../../application/_helpers/survey.helper');

module.exports = function buildCreateSurvey() {
  async function execute({ surveyId }) {
    const survey = await surveyHelper.findSurveyById(surveyId);
    await surveyHelper.generateSurveyPDF(survey);
    await survey.save();

    return survey;
  }

  return { execute };
};
