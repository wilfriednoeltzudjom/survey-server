const surveyHelper = require('../../application/_helpers/survey.helper');

module.exports = function buildDeleteSurvey() {
  async function execute({ surveyId }, { user }) {
    const survey = await surveyHelper.findSurveyById(surveyId);
    Object.assign(survey, { deleted: true, deletedAt: new Date(), deletedBy: user.id });

    return survey.save();
  }

  return { execute };
};
