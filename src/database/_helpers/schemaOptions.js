module.exports = function ({ versionKey = false, id = false } = {}) {
  return {
    timestamps: true,
    _id: id,
    versionKey,
    toJSON: { virtuals: true },
  };
};
