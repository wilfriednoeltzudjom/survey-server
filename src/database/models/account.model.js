const mongoose = require('mongoose');

const { ROLES, ACCOUNT_STATUSES } = require('../enums');
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
    status: { type: String, default: ACCOUNT_STATUSES.OPENED },
    deletable: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Account' },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'Account' },
  },
  schemaOptions({ id: true })
);
accountSchema.virtual('fullName').get(function () {
  return `${this.lastName} ${this.firstName}`;
});

module.exports = mongoose.models.Account || mongoose.model('Account', accountSchema);
