/** Thrown when the screenshot API answers with something other than an image. */
export default class ShotsnapError extends Error {
  readonly status: number;
  readonly contentType: string | null;
  /** Raw Retry-After header, or null when the API sends none. */
  readonly retryAfter: string | null;

  constructor(status: number, statusText: string, contentType: string | null, retryAfter: string | null) {
    const reason = status >= 200 && status < 300
      ? `HTTP ${status} with content-type ${contentType ?? "none"} instead of an image`
      : `HTTP ${status}${statusText ? ` ${statusText}` : ""}`;
    super(`Screenshot API answered ${reason}${retryAfter ? ` (Retry-After: ${retryAfter})` : ""}`);
    this.name = "ShotsnapError";
    this.status = status;
    this.contentType = contentType;
    this.retryAfter = retryAfter;
  }
}
