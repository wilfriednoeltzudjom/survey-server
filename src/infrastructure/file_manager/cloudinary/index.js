const cloudinary = require('cloudinary').v2;
const md5 = require('md5');
const DatauriParser = require('datauri/parser');
const path = require('path');

const { BadRequestError } = require('../../../application/_helpers/errors');
const logger = require('../../logger');

/**
 * Upload file to cloud
 * @param {Object} params
 * @param {Object} params.file
 * @param {String} params.folder
 * @returns
 */
async function uploadFile({ file, folder } = {}) {
  configureCloudinary();

  const response = await cloudinary.uploader.upload(toDataURIContent(file), {
    folder: getFileBaseFolder(folder),
  });
  if (!hasFileBeenCorrectlyUploaded(file, response)) {
    await deleteFile({ fileId: response._id });
    throw new BadRequestError(`Unable to upload file <${JSON.stringify(file)}> to folder <${folder}>`);
  }

  return { fileId: response.public_id, fileUrl: response.secure_url };
}

/**
 * Delete file from cloud
 * @param {Object} params
 * @param {Object} params.fileId
 */
async function deleteFile({ fileId }) {
  configureCloudinary();
  await cloudinary.uploader.destroy(fileId);
  logger.info(`File <${fileId}> successfully deleted`);
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function toDataURIContent(file) {
  const datauri = new DatauriParser().format(path.extname(file.originalname).toString(), file.buffer);

  return datauri.content;
}

function getFileBaseFolder(folder) {
  const ROOT_FOLDER = 'survey';
  const baseFolder = `${ROOT_FOLDER}/${process.env.NODE_ENV}`;

  return baseFolder.concat(folder ? `/${folder}` : '');
}

function hasFileBeenCorrectlyUploaded(file, response) {
  const fileEtag = md5(file.buffer);

  return fileEtag === response.etag;
}

module.exports = { uploadFile, deleteFile };
