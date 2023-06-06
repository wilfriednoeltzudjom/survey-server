const { HOUSEHOLD_SITUATIONS, MPR_PROFILES } = require('../../database/enums');

const { isNotEmptyString } = require('./dataValidator.helper');

const PARISIAN_REGIONS_INCOMES_CHART_PRECARITY = {
  1: 22461,
  2: 32967,
  3: 39591,
  4: 46226,
  5: 52886,
  additionalPerson: 6650,
};

const PARISIAN_REGIONS_INCOMES_CHART_MODEST = {
  1: 27343,
  2: 40130,
  3: 48197,
  4: 56277,
  5: 64380,
  additionalPerson: 8097,
};

const OTHER_REGIONS_INCOMES_CHART_PRECARITY = {
  1: 16229,
  2: 23734,
  3: 28545,
  4: 33346,
  5: 38168,
  additionalPerson: 4813,
};

const OTHER_REGIONS_INCOMES_CHART_MODEST = {
  1: 20805,
  2: 30427,
  3: 36591,
  4: 42748,
  5: 48930,
  additionalPerson: 6165,
};

const PARISIAN_REGIONS_INCOMES_CHART_MPR_BLUE = {
  1: 22461,
  2: 32967,
  3: 39591,
  4: 46226,
  5: 52886,
  additionalPerson: 6650,
  comparator: 'max',
};

const PARISIAN_REGIONS_INCOMES_CHART_MPR_YELLOW = {
  1: 27343,
  2: 40130,
  3: 48197,
  4: 56277,
  5: 64380,
  additionalPerson: 8097,
  comparator: 'max',
};

const PARISIAN_REGIONS_INCOMES_CHART_MPR_PURPLE = {
  1: 38184,
  2: 56130,
  3: 67585,
  4: 79041,
  5: 90496,
  additionalPerson: 11455,
  comparator: 'max',
};

const PARISIAN_REGIONS_INCOMES_CHART_MPR_PINK = {
  1: 38184,
  2: 56130,
  3: 67585,
  4: 79041,
  5: 90496,
  additionalPerson: 11455,
  comparator: 'min',
};

const OTHER_REGIONS_INCOMES_CHART_MPR_BLUE = {
  1: 16229,
  2: 23734,
  3: 28545,
  4: 33346,
  5: 38168,
  additionalPerson: 4813,
  comparator: 'max',
};

const OTHER_REGIONS_INCOMES_CHART_MPR_YELLOW = {
  1: 20805,
  2: 30427,
  3: 36591,
  4: 42748,
  5: 48930,
  additionalPerson: 6165,
  comparator: 'max',
};

const OTHER_REGIONS_INCOMES_CHART_MPR_PURPLE = {
  1: 29148,
  2: 42848,
  3: 51592,
  4: 60336,
  5: 69081,
  additionalPerson: 8744,
  comparator: 'max',
};

const OTHER_REGIONS_INCOMES_CHART_MPR_PINK = {
  1: 29148,
  2: 42848,
  3: 51592,
  4: 60336,
  5: 69081,
  additionalPerson: 8744,
  comparator: 'min',
};

/**
 * Get energy renovation premium situations
 * @param {Object} params
 * @returns
 */
function getEnergyRenovationPremiumsSituations({ postalCode, referenceTaxIncome, numberOfDependents }) {
  const inParisianRegion = ['75', '77', '78', '91', '92', '93', '94', '95'].includes(postalCode.slice(0, 2));

  return {
    householdSituation: getHouseholdSituation(inParisianRegion, referenceTaxIncome, numberOfDependents),
    mprProfile: getMaPrimeRenovProfile(inParisianRegion, referenceTaxIncome, numberOfDependents),
  };
}

/**
 * Get ma prime renov profile
 * @param {Boolean} inParisianRegion
 * @param {Number} referenceTaxIncome
 * @param {Number} numberOfDependents
 * @returns
 */
function getHouseholdSituation(inParisianRegion, referenceTaxIncome, numberOfDependents) {
  const inPrecaritySituation = isInPrecaritySituation(inParisianRegion, referenceTaxIncome, numberOfDependents);
  if (inPrecaritySituation) return HOUSEHOLD_SITUATIONS.PRECARITY;

  const inEnergyPrecarity = isInModestSituation(inParisianRegion, referenceTaxIncome, numberOfDependents);
  if (inEnergyPrecarity) return HOUSEHOLD_SITUATIONS.MODEST;

  return HOUSEHOLD_SITUATIONS.CLASSIC;
}

function isInPrecaritySituation(isInParisianRegion, referenceTaxIncome, numberOfDependents) {
  const incomesChart = isInParisianRegion ? PARISIAN_REGIONS_INCOMES_CHART_PRECARITY : OTHER_REGIONS_INCOMES_CHART_PRECARITY;
  const incomeThreshold = calculateIncomeThreshold(incomesChart, numberOfDependents);

  return incomeThreshold > referenceTaxIncome;
}

function isInModestSituation(isInParisianRegion, referenceTaxIncome, numberOfDependents) {
  const incomesChart = isInParisianRegion ? PARISIAN_REGIONS_INCOMES_CHART_MODEST : OTHER_REGIONS_INCOMES_CHART_MODEST;
  const incomeThreshold = calculateIncomeThreshold(incomesChart, numberOfDependents);

  return incomeThreshold > referenceTaxIncome;
}

function calculateIncomeThreshold(incomesChart, numberOfDependents) {
  if (numberOfDependents > 5) {
    const additionalPersons = numberOfDependents - 5;

    return incomesChart[5] + incomesChart.additionalPerson * additionalPersons;
  }

  return incomesChart[numberOfDependents];
}

/**
 * Get ma prime renov profile
 * @param {Boolean} inParisianRegion
 * @param {Number} referenceTaxIncome
 * @param {Number} numberOfDependents
 * @returns
 */
function getMaPrimeRenovProfile(inParisianRegion, referenceTaxIncome, numberOfDependents) {
  if (referenceTaxIncome === 0) return MPR_PROFILES.BLUE;

  const incomesCharts = getIncomesCharts(inParisianRegion);
  const [incomesChartName] =
    Object.entries(incomesCharts).find(([, incomesChart]) => {
      return isEligibleForMaPrimeRenov(incomesChart, referenceTaxIncome, numberOfDependents);
    }) || [];

  return isNotEmptyString(incomesChartName) ? incomesChartName.slice(incomesChartName.lastIndexOf('_') + 1) : MPR_PROFILES.NONE;
}

function isEligibleForMaPrimeRenov(incomesChart, referenceTaxIncome, numberOfDependents) {
  const incomeThreshold = calculateIncomeThreshold(incomesChart, numberOfDependents);
  const dynamicOperators = {
    min: (a, b) => a > b,
    max: (a, b) => a <= b,
  };

  return dynamicOperators[incomesChart.comparator](referenceTaxIncome, incomeThreshold);
}

function getIncomesCharts(inParisianRegion) {
  return inParisianRegion
    ? {
        PARISIAN_REGIONS_INCOMES_CHART_MPR_BLUE,
        PARISIAN_REGIONS_INCOMES_CHART_MPR_YELLOW,
        PARISIAN_REGIONS_INCOMES_CHART_MPR_PURPLE,
        PARISIAN_REGIONS_INCOMES_CHART_MPR_PINK,
      }
    : {
        OTHER_REGIONS_INCOMES_CHART_MPR_BLUE,
        OTHER_REGIONS_INCOMES_CHART_MPR_YELLOW,
        OTHER_REGIONS_INCOMES_CHART_MPR_PURPLE,
        OTHER_REGIONS_INCOMES_CHART_MPR_PINK,
      };
}

module.exports = { getEnergyRenovationPremiumsSituations };
