const { cloneDeep } = require('lodash');
const { isNonEmptyObject } = require('./dataValidator.helper');

/**
 * Serialize database responses
 * @param {Object} response
 * @returns
 */
function serializeResponse(response) {
  if (Array.isArray(response)) return serializeArray(response);

  return serializeObject(response);
}

function serializeArray(array = []) {
  return array.map(serializeObject);
}

function serializeObject(object = {}) {
  const serializedObject = removeUnneededProperties(object);
  if (doesObjectIncludeNonEmptyObjects(serializedObject)) {
    Object.keys(serializedObject).forEach((property) => {
      if (isNonEmptyObject(serializedObject[property])) {
        serializedObject[property] = serializeObject(serializedObject[property]);
      }
    });
  }

  return serializedObject;
}

function removeUnneededProperties(object) {
  const clone = cloneDeep(JSON.parse(JSON.stringify(object)));
  delete clone._id;
  delete clone.__v;
  delete clone.password;

  return clone;
}

function doesObjectIncludeNonEmptyObjects(object) {
  return Object.keys(object).some((property) => isNonEmptyObject(object[property]));
}

module.exports = { serializeResponse };
