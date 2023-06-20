const buildCreateSurveyUseCase = require('../use_cases/surveys/createSurvey.usecase');
const buildGetSurveysUseCase = require('../use_cases/surveys/getSurveys.usecase');
const buildGetSurveyUseCase = require('../use_cases/surveys/getSurvey.usecase');
const buildDeleteSurveyUseCase = require('../use_cases/surveys/deleteSurvey.usecase');
const buildGenerateSurveyReportUseCase = require('../use_cases/surveys/generateSurveyReport.usecase');
const { HttpResponse } = require('../application/payloads');
const MESSAGES = require('../application/messages');

module.exports = function buildSurveyController(dependencies) {
  const createSurveyUseCase = buildCreateSurveyUseCase(dependencies);
  const getSurveysUseCase = buildGetSurveysUseCase(dependencies);
  const getSurveyUseCase = buildGetSurveyUseCase(dependencies);
  const deleteSurveyUseCase = buildDeleteSurveyUseCase(dependencies);
  const generateSurveyReportUseCase = buildGenerateSurveyReportUseCase(dependencies);

  async function createSurvey(request) {
    const survey = await createSurveyUseCase.execute(request.body, { user: request.user });

    return HttpResponse.created({
      message: MESSAGES.SURVEY_CREATED,
      data: survey,
    });
  }

  async function getSurveys(request) {
    const surveys = await getSurveysUseCase.execute({ user: request.user });

    return HttpResponse.succeeded({
      data: surveys,
    });
  }

  async function getSurvey(request) {
    const survey = await getSurveyUseCase.execute(request.params);

    return HttpResponse.succeeded({
      data: survey,
    });
  }

  async function deleteSurvey(request) {
    const survey = await deleteSurveyUseCase.execute(request.params, { user: request.user });

    return HttpResponse.succeeded({
      message: MESSAGES.SURVEY_DELETED(survey),
      data: survey,
    });
  }

  async function generateSurveyReport(request) {
    const survey = await generateSurveyReportUseCase.execute(request.params);

    return HttpResponse.succeeded({
      message: MESSAGES.SURVEY_GENERATED(survey),
      data: survey,
    });
  }

  return { createSurvey, getSurveys, getSurvey, deleteSurvey, generateSurveyReport };
};
