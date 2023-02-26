import fetch from "node-fetch";
/**
 *
 * @param {string} url - url address for fetching with get method
 * @returns { arrayBuffer }
 */
const httpGet = async (url: string) => {
  try {
    let response = await fetch(url, { method: "GET" });
    const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (err) {
    console.warn("ShotSnap error: ", err);
  }
};
export default httpGet;
