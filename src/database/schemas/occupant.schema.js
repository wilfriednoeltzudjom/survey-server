const mongoose = require('mongoose');

const schemaOptions = require('../_helpers/schemaOptions');

const { Schema } = mongoose;

module.exports = new Schema(
  {
    taxNoticeNumber: { type: String },
    taxNoticeReference: { type: String },
    referenceTaxIncome: { type: Number },
    birthDate: { type: Date },
  },
  schemaOptions()
);
