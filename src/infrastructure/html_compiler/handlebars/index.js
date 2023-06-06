const hbs = require('handlebars');
const path = require('path');
const fs = require('fs-extra');

/**
 * Generate html string from handlebars template
 * @param {String} templateName
 * @param {Object} data
 * @returns
 */
async function compile(templateName, data = {}) {
  setupHelpers();

  const filePath = path.join(__dirname, '../../../application/templates', `${templateName}.hbs`);
  const html = await fs.readFile(filePath, 'utf-8');

  return hbs.compile(html)(data);
}

function setupHelpers() {}

module.exports = { compile };
