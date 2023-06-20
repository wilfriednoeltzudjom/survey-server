const { Survey } = require('../../database/models');

const {
  HOUSEHOLD_SITUATIONS,
  LOFT_TYPES,
  INSULATION_PERIODS,
  HEATING_TYPES,
  BUILDING_AGES,
  OWNING_TYPES,
  WALL_INSULATION_TYPES,
  WATER_HEATING_TYPES,
  RADIATOR_TYPES,
  OPERATION_TYPES,
} = require('../../database/enums');
const MESSAGES = require('../messages');

const { formatDate } = require('../../infrastructure/date_utilities/moment');
const { isNullishOrEmpty, isNotEmptyString, removeNullishInString } = require('./dataValidator.helper');
const { ResourceNotFoundError } = require('./errors');
const { createFileObjectFromPath } = require('./file.helper');
const htmlCompiler = require('../../infrastructure/html_compiler');
const fileManager = require('../../infrastructure/file_manager');
const pdfGenerator = require('../../infrastructure/pdf_generator');
const logger = require('../../infrastructure/logger');

/**
 * Format survey for pdf generation
 * @param {Object} survey
 * @returns
 */
function formatSurveyForPDFGeneration(survey) {
  return {
    ...survey,
    department: formatDepartment(survey),
    fullAddress: formatFullAddress(survey),
    phone: formatPhoneNumber(survey),
    ...formatOccupants(survey),
    ...formatCheckboxesProperties(survey),
  };
}

function formatDepartment({ postalCode }) {
  return isNotEmptyString(postalCode) ? postalCode.substr(0, 2) : '';
}

function formatFullAddress({ streetNumber, streetName, city, postalCode }) {
  return removeNullishInString(`${streetNumber} ${streetName}, ${postalCode} ${city}`);
}

function formatOccupants({ occupants }) {
  const [occupantOne, occupantTwo] = occupants;

  return { occupantOne: formatOccupant(occupantOne), occupantTwo: formatOccupant(occupantTwo) };
}

function formatOccupant(occupant) {
  if (isNullishOrEmpty(occupant)) return occupant;

  return { ...occupant, birthDate: formatDate({ date: occupant.birthDate }) };
}

function formatPhoneNumber({ phone }) {
  return phone ? phone.padStart(10, '0').match(/\d{2}/g).join('.') : '';
}

function formatCheckboxesProperties({
  householdSituation,
  loftIncluded,
  loftType,
  loftInsulated,
  loftInsulationPeriod,
  mprBeneficiary,
  oneEuroBenificiary,
  heatingType,
  oilHeatingTypeBoiler,
  buildingAge,
  owningType,
  wallInsulationType,
  waterHeatingType,
  jointOwners,
  basementIncluded,
  basementHeated,
  lowFloorInsulationPeriod,
  fireplaceIncluded,
  basementAreaForBoiler,
  radiatorType,
  operationType,
}) {
  const additionalProperties = {};
  if (loftIncluded) additionalProperties.loftNotInsulated = !loftInsulated;
  if (loftInsulated) {
    additionalProperties.loftInsulationPeriodMoreThanTenYears = loftInsulationPeriod === INSULATION_PERIODS.MORE_THAN_TEN_YEARS;
    additionalProperties.loftInsulationPeriodLessThanTenYears = loftInsulationPeriod === INSULATION_PERIODS.LESS_THAN_TEN_YEARS;
  }
  if (heatingType === HEATING_TYPES.GAS) additionalProperties.notOilHeatingTypeBoiler = !oilHeatingTypeBoiler;
  if (basementIncluded) {
    additionalProperties.basementNotHeated = !basementHeated;
    additionalProperties.nonBasementAreaForBoiler = !basementAreaForBoiler;
  }

  return {
    householdSituationPrecarity: householdSituation === HOUSEHOLD_SITUATIONS.PRECARITY,
    householdSituationModest: householdSituation === HOUSEHOLD_SITUATIONS.MODEST,
    householdSituationClassic: householdSituation === HOUSEHOLD_SITUATIONS.CLASSIC,
    loftNotIncluded: !loftIncluded,
    loftTypeLostAccessible: loftType === LOFT_TYPES.LOST_ACCESSIBLE,
    loftTypeLostInaccessible: loftType === LOFT_TYPES.LOST_INACCESSIBLE,
    loftTypeFurnished: loftType === LOFT_TYPES.FURNISHED,
    loftTypeConvertible: loftType === LOFT_TYPES.CONVERTIBLE,
    nonMprBeneficiary: !mprBeneficiary,
    nonOneEuroBenificiary: !oneEuroBenificiary,
    heatingTypeWood: heatingType === HEATING_TYPES.WOOD,
    heatingTypeGas: heatingType === HEATING_TYPES.GAS,
    heatingTypeOil: heatingType === HEATING_TYPES.OIL,
    heatingTypeHeatingPump: heatingType === HEATING_TYPES.HEATING_PUMP,
    heatingTypeElectricity: heatingType === HEATING_TYPES.ELECTRICITY,
    buildingAgeMoreThanFifteenYears: buildingAge === BUILDING_AGES.MORE_THAN_FIFTEEN_YEARS,
    buildingAgeLessThanFifteenYears: buildingAge === BUILDING_AGES.LESS_THAN_FIFTEEN_YEARS,
    owningTypeOwnerOccupant: owningType === OWNING_TYPES.OWNER_OCCUPANT,
    owningTypeTenant: owningType === OWNING_TYPES.TENANT,
    owningTypeSCI: owningType === OWNING_TYPES.SCI,
    wallInsulationTypeITI: wallInsulationType === WALL_INSULATION_TYPES.ITI,
    wallInsulationTypeITE: wallInsulationType === WALL_INSULATION_TYPES.ITE,
    wallInsulationTypeNone: wallInsulationType === WALL_INSULATION_TYPES.NONE,
    waterHeatingTypeDefaultHeating: waterHeatingType === WATER_HEATING_TYPES.DEFAULT_HEATING,
    waterHeatingTypeElectricity: waterHeatingType === WATER_HEATING_TYPES.ELECTRICITY,
    waterHeatingTypeBallon: waterHeatingType === WATER_HEATING_TYPES.BALLOON,
    waterHeatingTypeOther: waterHeatingType === WATER_HEATING_TYPES.OTHER,
    notJointOwners: !jointOwners,
    basementNotIncluded: !basementIncluded,
    lowFloorInsulationPeriodMoreThanTenYears: lowFloorInsulationPeriod === INSULATION_PERIODS.MORE_THAN_TEN_YEARS,
    lowFloorInsulationPeriodLessThanTenYears: lowFloorInsulationPeriod === INSULATION_PERIODS.LESS_THAN_TEN_YEARS,
    fireplaceNotIncluded: !fireplaceIncluded,
    radiatorTypeClassic: radiatorType === RADIATOR_TYPES.CLASSIC,
    radiatorTypeElectric: radiatorType === RADIATOR_TYPES.ELECTRIC,
    operationTypeMPR: operationType === OPERATION_TYPES.MPR,
    operationTypeRENO: operationType === OPERATION_TYPES.RENO,
    operationTypeRAC: operationType === OPERATION_TYPES.RAC,
    ...additionalProperties,
  };
}

/**
 * Find survey by id
 * @param {String} surveyId
 * @returns
 */
async function findSurveyById(surveyId) {
  const survey = await Survey.findById({ _id: surveyId, deleted: false }).populate('createdBy');
  if (isNullishOrEmpty(survey)) throw new ResourceNotFoundError(MESSAGES.SURVEY_NOT_FOUND({ surveyId }));

  return survey;
}

/**
 * Generate survey pdf
 * @param {Object} survey
 */
async function generateSurveyPDF(survey) {
  const bodyTemplate = await htmlCompiler.compile('survey', formatSurveyForPDFGeneration(survey.toJSON()));
  await pdfGenerator.generatePDFFromHTMLTemplate(
    { bodyTemplate },
    {},
    async function (filepath) {
      const uploadResponse = await fileManager.uploadFile({ file: createFileObjectFromPath(filepath) });
      Object.assign(survey, uploadResponse);
    },
    function (error) {
      if (error) logger.error(MESSAGES.SURVEY_PDF_GENERATION_ERROR(survey, error));
    }
  );
}

module.exports = { formatSurveyForPDFGeneration, findSurveyById, generateSurveyPDF };
