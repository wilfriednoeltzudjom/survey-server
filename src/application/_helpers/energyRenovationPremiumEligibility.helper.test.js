const energyRenovationPremiumEligibilityHelper = require('./energyRenovationPremiumEligibility.helper');

const { HOUSEHOLD_SITUATIONS, MPR_PROFILES } = require('../../database/enums');

describe('Helpers - Energy renovation premium eligibility helper', () => {
  it('should calculate precarity household', () => {
    const eligibility = energyRenovationPremiumEligibilityHelper.getEnergyRenovationPremiumsSituations({
      postalCode: '95150',
      referenceTaxIncome: 20228,
      numberOfDependents: 2,
    });
    expect(eligibility).to.not.be.empty;
    expect(eligibility.householdSituation).to.eql(HOUSEHOLD_SITUATIONS.PRECARITY);
    expect(eligibility.mprProfile).to.eql(MPR_PROFILES.BLUE);
  });

  it('should calculate modest household', () => {
    const eligibility = energyRenovationPremiumEligibilityHelper.getEnergyRenovationPremiumsSituations({
      postalCode: '62240',
      referenceTaxIncome: 42368,
      numberOfDependents: 4,
    });
    expect(eligibility).to.not.be.empty;
    expect(eligibility.householdSituation).to.eql(HOUSEHOLD_SITUATIONS.MODEST);
    expect(eligibility.mprProfile).to.eql(MPR_PROFILES.YELLOW);
  });

  it('should calculate classic household', () => {
    const eligibility = energyRenovationPremiumEligibilityHelper.getEnergyRenovationPremiumsSituations({
      postalCode: '60840',
      referenceTaxIncome: 35949,
      numberOfDependents: 1,
    });
    expect(eligibility).to.not.be.empty;
    expect(eligibility.householdSituation).to.eql(HOUSEHOLD_SITUATIONS.CLASSIC);
    expect(eligibility.mprProfile).to.eql(MPR_PROFILES.PINK);
  });
});
