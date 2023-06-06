const moment = require('moment');

function isAfter({ dateAfter = moment(), dateBefore = moment(), dateUnit = 'days' } = {}) {
  return moment(dateAfter).isAfter(dateBefore, dateUnit);
}

function isEqual({ comparedDate = moment(), date = moment(), dateUnit = 'days' } = {}) {
  return moment(comparedDate).isSame(date, dateUnit);
}

function diff({ dateAfter = moment(), dateBefore = moment(), dateUnit = 'days' } = {}) {
  let formattedDateAfer = dateAfter;
  let formattedDateBefore = dateBefore;
  if (dateUnit === 'days') {
    formattedDateAfer = moment(dateAfter).format('YYYY-MM-DD');
    formattedDateBefore = moment(dateBefore).format('YYYY-MM-DD');
  }

  return Math.round(moment(formattedDateAfer).diff(formattedDateBefore, dateUnit, true));
}

function add({ date = moment(), amount = 0, dateUnit = 'days' } = {}) {
  return moment(date).add(amount, dateUnit).toDate();
}

function substract({ date = moment(), amount = 0, dateUnit = 'days' } = {}) {
  return moment(date).subtract(amount, dateUnit).toDate();
}

function now() {
  return moment().toDate();
}

function formatDate({ date = moment(), format = 'DD/MM/YYYY' } = {}) {
  return moment(date).format(format);
}

module.exports = { isAfter, isEqual, diff, add, substract, now, formatDate };
