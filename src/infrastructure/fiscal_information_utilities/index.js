const axios = require('axios').default;

const BASE_URL = 'https://www.impots.gouv.fr/verifavis2-api/api/verifavisback/spi/';

/**
 * Check if tax notice information are correct
 * @param {Object} params
 * @param {Object} params.taxNoticeNumber
 * @param {Object} params.taxNoticeReference
 * @returns
 */
async function isTaxNoticeValid({ taxNoticeNumber, taxNoticeReference } = {}) {
  try {
    const { data } = await axios.get(`${BASE_URL}/${taxNoticeNumber}/numavis/${taxNoticeReference}`);
    const { conforme = false } = data;

    return conforme;
  } catch (error) {
    return false;
  }
}

module.exports = { isTaxNoticeValid };
