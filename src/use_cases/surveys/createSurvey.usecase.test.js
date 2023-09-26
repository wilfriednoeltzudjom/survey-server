const dependencies = require('../../infrastructure/dependencies');
const createSurveyUseCase = require('./createSurvey.usecase')(dependencies);

const { accountFactory, surveyFactory } = require('../../database/factories');

describe.only('Usecase - Create survey', () => {
  beforeEach(async () => {
    this.account = await accountFactory.createAccount();
  });

  it('should create survey', async () => {
    const surveyForm = surveyFactory.generateSurvey();

    const survey = await expect(createSurveyUseCase.execute(surveyForm, { user: this.account })).to.be.fulfilled;
    expect(survey.reference).to.eql('DOC-POEYA-00001');
  });
});
