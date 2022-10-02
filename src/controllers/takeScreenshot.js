const httpGet = require("../usecases/http/get/httpGet");
const fs = require("fs/promises");
const buffer = require("buffer");
/**
 *
 * @param {string} pageUrl - Website url
 * @param {Array} screenSize - Screen size
 * @param {boolean} saveFile - Save file or not
 * @param {string} fileName - Saving by name
 * @returns {Buffer}
 */
module.exports = async function takeScreenshot({
  pageUrl,
  screenSize,
  saveFile,
  fileName,
}) {
  const screenshot = await httpGet(
    `https://shotsnap.vercel.app/api/screenshot?page=${pageUrl}`
  );
  if (saveFile)
    await fs.writeFile(fileName || `shotsnap.png`, Buffer.from(screenshot));
  else return Buffer.from(screenshot);
};
