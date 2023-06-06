const mongoose = require('mongoose');

const { ROLES } = require('../enums');
const schemaOptions = require('../_helpers/schemaOptions');
const { capitalize, toLowerCase } = require('../../application/_helpers/dataValidator.helper');

const { Schema } = mongoose;

const accountSchema = new Schema(
  {
    lastName: { type: String, required: true, set: capitalize },
    firstName: { type: String, required: true, set: capitalize },
    email: { type: String, required: true, set: toLowerCase },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: Object.values(ROLES) },
  },
  schemaOptions({ id: true })
);

module.exports = mongoose.models.Account || mongoose.model('Account', accountSchema);
