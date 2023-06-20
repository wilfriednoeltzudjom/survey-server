const { Survey } = require('../../database/models');
const MESSAGES = require('../../application/messages');
const { BadRequestError } = require('../../application/_helpers/errors');
const { getEnergyRenovationPremiumsSituations } = require('../../application/_helpers/energyRenovationPremiumEligibility.helper');
const surveyHelper = require('../../application/_helpers/survey.helper');
const { removeNullishInObject } = require('../../application/_helpers/dataValidator.helper');

module.exports = function buildCreateSurvey(dependencies) {
  const { fiscalInformationUtilities } = dependencies;

  async function execute(surveyData = {}, { user } = {}) {
    const survey = new Survey(removeNullishInObject({ ...surveyData, createdBy: user.id }));
    await survey.validate();
    await ensureTaxNoticeIsValid(survey);
    await ensureSurveyDoesNotExist(survey);
    await setSurveyReference(survey);
    setEnergyRenovationPremiumsSituations(survey);
    await surveyHelper.generateSurveyPDF(survey);
    await survey.save();
    await survey.populate('createdBy');

    return survey;
  }

  async function ensureTaxNoticeIsValid({ occupants: [occupant = {}] = [] }) {
    const taxNoticeValid = await fiscalInformationUtilities.isTaxNoticeValid(occupant);
    if (!taxNoticeValid) throw new BadRequestError(MESSAGES.TAX_NOTICE_NOT_VALID);
  }

  async function ensureSurveyDoesNotExist({ occupants: [occupant = {}] = [] }) {
    const existingSurveysCount = await Survey.countDocuments({
      deleted: false,
      'occupants.taxNoticeNumber': occupant.taxNoticeNumber,
      'occupants.taxNoticeReference': occupant.taxNoticeReference,
    });
    if (existingSurveysCount > 0) {
      throw new BadRequestError(MESSAGES.SURVEY_ALREADY_EXISTS(occupant));
    }
  }

  async function setSurveyReference(survey) {
    const surveysCount = await Survey.countDocuments();
    survey.reference = 'DOC-POEYA-'.concat(String(surveysCount + 1).padStart(5, '0'));
  }

  function setEnergyRenovationPremiumsSituations(survey) {
    const { postalCode, numberOfDependents, occupants = [] } = survey;
    const referenceTaxIncome = occupants.reduce((total, occupant) => {
      return total + occupant.referenceTaxIncome;
    }, 0);
    Object.assign(survey, getEnergyRenovationPremiumsSituations({ postalCode, referenceTaxIncome, numberOfDependents }));
  }

  return { execute };
};
