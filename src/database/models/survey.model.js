const mongoose = require('mongoose');

const {
  BUILDING_AGES,
  HEATING_TYPES,
  HOUSEHOLD_SITUATIONS,
  INSULATION_PERIODS,
  LOFT_TYPES,
  MPR_PROFILES,
  OWNING_TYPES,
  WALL_INSULATION_TYPES,
  WATER_HEATING_TYPES,
  RADIATOR_TYPES,
  OPERATION_TYPES,
} = require('../enums');
const occupantSchema = require('../schemas/occupant.schema');
const schemaOptions = require('../_helpers/schemaOptions');
const { capitalize } = require('../../application/_helpers/dataValidator.helper');

const { Schema } = mongoose;

const surveySchema = new Schema(
  {
    reference: { type: String },
    operationType: { type: String, enum: Object.values(OPERATION_TYPES) },
    fullName: { type: String, required: true, set: capitalize },
    streetNumber: { type: String, required: true },
    streetName: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String },
    occupants: [occupantSchema],
    numberOfDependents: { type: Number, default: 0 },
    householdSituation: { type: String, enum: Object.values(HOUSEHOLD_SITUATIONS) },
    mprProfile: { type: String, enum: Object.values(MPR_PROFILES) },
    livingSpaceArea: { type: Number, required: true },
    loftIncluded: { type: Boolean, default: false, required: true },
    loftType: { type: String, enum: Object.values(LOFT_TYPES) },
    loftArea: { type: Number },
    loftInsulated: { type: Boolean, default: false },
    loftInsulationPeriod: { type: String, enum: Object.values(INSULATION_PERIODS) },
    mprBeneficiary: { type: Boolean, default: false },
    oneEuroBenificiary: { type: Boolean, default: false },
    heatingType: { type: String, enum: Object.values(HEATING_TYPES), required: true },
    oilHeatingTypeBoiler: { type: Boolean, default: false },
    buildingAge: { type: String, enum: Object.values(BUILDING_AGES), required: true },
    owningType: { type: String, enum: Object.values(OWNING_TYPES), required: true },
    wallInsulationType: { type: String, enum: Object.values(WALL_INSULATION_TYPES), required: true },
    waterHeatingType: { type: String, enum: Object.values(WATER_HEATING_TYPES), required: true },
    waterHeatingTypeSpecified: { type: String, default: '' },
    jointOwners: { type: Boolean, default: false },
    jointOwnersCount: { type: Number, default: 0 },
    basementIncluded: { type: Boolean, default: false },
    basementHeated: { type: Boolean, default: false },
    lowFloorInsulationPeriod: { type: String, enum: Object.values(INSULATION_PERIODS) },
    radiatorsCount: { type: Number, default: 0 },
    fireplaceIncluded: { type: Boolean, default: false },
    basementAreaForBoiler: { type: Boolean, default: false },
    phone: { type: String, default: '' },
    comments: { type: String, default: '' },
    loftComments: { type: String, default: '' },
    radiatorType: { type: String, enum: Object.values(RADIATOR_TYPES) },
    fileId: { type: String },
    fileUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'Account' },
  },
  schemaOptions({ id: true })
);

module.exports = mongoose.models.Survey || mongoose.model('Survey', surveySchema);
