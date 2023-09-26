const sinon = require('sinon');
const { faker } = require('@faker-js/faker');

const { FILE_TYPES } = require('./database/enums');

const databaseHelper = require('./application/_helpers/database.helper');
const envHelper = require('./application/_helpers/env.helper');
const surveyHelper = require('./application/_helpers/survey.helper');
const fileManager = require('../src/infrastructure/file_manager');
const fiscalInformationUtilities = require('../src/infrastructure/fiscal_information_utilities');

const sandbox = sinon.createSandbox();

before(async () => {
  envHelper.loadEnvFile('default');
  envHelper.loadEnvFile(process.env.NODE_ENV);

  await databaseHelper.connectDatabase();
});

beforeEach(async () => {
  await databaseHelper.clearDatabase();

  global.payloads = {
    file: {
      originalname: 'filename.pdf',
      buffer: Buffer.from(['filename']),
      mimetype: 'application/pdf',
    },
    uploadedFile: {
      fileId: faker.string.nanoid(),
      fileUrl: faker.image.url(),
    },
  };
  global.stubs = {
    fileManager: {
      uploadFile: sandbox.stub(fileManager, 'uploadFile').resolves(global.payloads.uploadedFile),
      deleteFile: sandbox.stub(fileManager, 'deleteFile').resolves(),
    },
    surveyHelper: {
      generateSurveyPDF: sandbox.stub(surveyHelper, 'generateSurveyPDF').callsFake(async function (survey) {
        Object.assign(survey, global.payloads.uploadedFile);

        return survey;
      }),
    },
    fiscalInformationUtilities: {
      isTaxNoticeValid: sandbox.stub(fiscalInformationUtilities, 'isTaxNoticeValid').returns(true),
    },
  };
});

afterEach(() => {
  sandbox.restore();
});

after(async () => {
  await databaseHelper.closeDatabase();
});
