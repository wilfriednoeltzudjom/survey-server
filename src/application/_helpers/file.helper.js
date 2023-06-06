const fs = require('fs');
const path = require('path');

function createFileObjectFromPath(filePath) {
  const buffer = fromPathToBuffer(filePath);
  const orginalName = path.basename(filePath);

  return { buffer, originalname: orginalName };
}

function fromPathToBuffer(filePath) {
  const data = fs.readFileSync(filePath);

  return Buffer.from(data);
}

module.exports = {
  createFileObjectFromPath,
  fromPathToBuffer,
};
