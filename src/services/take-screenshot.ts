import fetch from "../utils/fetch";
import fs from "fs/promises";
import ITakeScreenshot from "../interfaces/ITakeScreenshot";
/**
 *
 * @param {string} pageUrl - Website url
 * @param {Array} screenSize - Screen size
 * @param {boolean} saveFile - Save file or not
 * @param {string} fileName - Saving by name
 * @returns {Buffer}
 */
const takeScreenshot = async ({
  pageUrl,
  screenWidth,
  screenHeight,
  saveFile,
  fileName,
}: ITakeScreenshot) => {
  const screenshot: ArrayBuffer | undefined = await fetch(
    {
      url: `https://shotsnap.vercel.app/api/screenshot?page=${pageUrl}&width=${screenWidth || 800
        }&height=${screenHeight || 768}`,
      method: "GET"
    }
  );
  if (saveFile)
    await fs.writeFile(fileName || `shotsnap.png`, Buffer.from(screenshot!));
  return Buffer.from(screenshot!);
};

export default takeScreenshot;
