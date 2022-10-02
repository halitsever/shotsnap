/**
 *
 * @param {string} url - url address for fetching with get method
 * @returns { arrayBuffer }
 */
module.exports = async function httpGet(url) {
  try {
    console.log({ url });
    let response = await fetch(url, { method: 'GET' });
    response = await response.arrayBuffer();
    return response;
  } catch (err) {
    console.warn('Error: ', err);
  }
};
