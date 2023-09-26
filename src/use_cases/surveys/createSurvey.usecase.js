const { Survey } = require('../../database/models');
const MESSAGES = require('../../application/messages');
const { BadRequestError } = require('../../application/_helpers/errors');
const energyRenovationPremiumEligibilityHelper = require('../../application/_helpers/energyRenovationPremiumEligibility.helper');
const surveyHelper = require('../../application/_helpers/survey.helper');
const { removeNullishInObject, isNonEmptyObject, isNonEmptyString } = require('../../application/_helpers/dataValidator.helper');

module.exports = function buildCreateSurvey(dependencies) {
  const SURVEY_REFERENCE_PREFIX = 'DOC-POEYA-';

  const { fiscalInformationUtilities } = dependencies;

  async function execute(surveyData = {}, { user } = {}) {
    const survey = new Survey(removeNullishInObject({ ...surveyData, createdBy: user.id }));
    await survey.validate();
    await ensureTaxNoticeIsValid(survey);
    await ensureSurveyDoesNotExist(survey);
    await setSurveyReference(survey);
    setEnergyRenovationPremiumsSituations(survey);
    await surveyHelper.generateSurveyPDF(survey);
    await ensureSurveyReferenceIsUnique(survey);
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
    survey.reference = formatSurveyReference(surveysCount + 1);
  }

  function formatSurveyReference(referenceDigits) {
    return SURVEY_REFERENCE_PREFIX.concat(String(referenceDigits).padStart(5, '0'));
  }

  function setEnergyRenovationPremiumsSituations(survey) {
    const { postalCode, numberOfDependents, occupants = [] } = survey;
    const referenceTaxIncome = occupants.reduce((total, occupant) => {
      return total + occupant.referenceTaxIncome;
    }, 0);
    Object.assign(
      survey,
      energyRenovationPremiumEligibilityHelper.getEnergyRenovationPremiumsSituations({ postalCode, referenceTaxIncome, numberOfDependents })
    );
  }

  async function ensureSurveyReferenceIsUnique(survey) {
    const duplicateSurvey = await Survey.findOne({ reference: survey.reference });
    if (isNonEmptyObject(duplicateSurvey) && isNonEmptyString(duplicateSurvey.reference)) {
      const referenceDigits = Number(duplicateSurvey.reference.split(SURVEY_REFERENCE_PREFIX)[1]);
      survey.reference = formatSurveyReference(referenceDigits + 1);
    }
  }

  return { execute };
};
