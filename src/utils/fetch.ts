import nodeFetch from "node-fetch";
import IFetchOptions from "../interfaces/IFetchOptions";

/** Network errors reject with their original cause so callers can catch them. */
const fetch = ({ url, method }: IFetchOptions) => nodeFetch(url, { method });

export default fetch;
