const buildAuthControler = require('./auth.controller');
const buildSurveyControler = require('./survey.controller');
const fileManager = require('../infrastructure/file_manager');
const fiscalInformationUtilities = require('../infrastructure/fiscal_information_utilities');
const htmlCompiler = require('../infrastructure/html_compiler');
const pdfGenerator = require('../infrastructure/pdf_generator');
const securityUtilities = require('../infrastructure/security');
const logger = require('../infrastructure/logger');

const dependencies = { fileManager, fiscalInformationUtilities, htmlCompiler, pdfGenerator, securityUtilities, logger };

module.exports = { authController: buildAuthControler(dependencies), surveyController: buildSurveyControler(dependencies) };
