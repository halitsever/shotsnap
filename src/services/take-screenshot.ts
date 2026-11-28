import fetch from "../utils/fetch";
import fs from "fs/promises";
import ITakeScreenshot from "../interfaces/ITakeScreenshot";
import ShotsnapError from "../errors/shotsnap-error";

const ENDPOINT = "https://shotsnap.vercel.app/api/screenshot";

/** A value that already starts with an encoded scheme is sent as is, so it is not encoded twice. */
const encodePageUrl = (pageUrl: string) => (/^https?%3A/i.test(pageUrl) ? pageUrl : encodeURIComponent(pageUrl));

export const screenshotUrl = ({ pageUrl, screenWidth, screenHeight }: Pick<ITakeScreenshot, "pageUrl" | "screenWidth" | "screenHeight">) =>
  `${ENDPOINT}?page=${encodePageUrl(pageUrl)}&width=${screenWidth || 800}&height=${screenHeight || 768}`;

/**
 * Captures pageUrl through the hosted API and resolves to the image Buffer.
 * Rejects with a ShotsnapError when the API answers with an error or a non-image body.
 */
const takeScreenshot = async ({ pageUrl, screenWidth, screenHeight, saveFile, fileName }: ITakeScreenshot) => {
  const response = await fetch({ url: screenshotUrl({ pageUrl, screenWidth, screenHeight }), method: "GET" });

  const contentType = response.headers.get("content-type");
  if (!response.ok || !contentType?.startsWith("image/")) {
    throw new ShotsnapError(response.status, response.statusText, contentType, response.headers.get("retry-after"));
  }

  const screenshot = Buffer.from(await response.arrayBuffer());
  if (saveFile) await fs.writeFile(fileName || `shotsnap.png`, screenshot);
  return screenshot;
};

export default takeScreenshot;
