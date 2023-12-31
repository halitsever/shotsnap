import nodeFetch from "node-fetch";
import IFetch from "../interfaces/IFetch";
/**
 *
 * @param {string} url - url address for fetching with get method
 * @returns { arrayBuffer }
 */
const fetch = async ({ url, method }: IFetch) => {
  try {
    const response = await nodeFetch(url, { method });
    const arrayBuffer: ArrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (err) {
    console.warn("ShotSnap error: ", err);
  }
};
export default fetch;
