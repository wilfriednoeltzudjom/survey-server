function getSafeDeleteParams(user = {}) {
  return { deleted: true, deletedAt: new Date(), deletedBy: user.id };
}

function assignSafeDeleteParams(object, user = {}) {
  return Object.assign(object, user);
}

module.exports = { getSafeDeleteParams, assignSafeDeleteParams };
