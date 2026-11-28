import { afterEach, beforeEach, describe, expect, jest, test } from "@jest/globals";
import fs from "fs";
import os from "os";
import path from "path";

jest.mock("node-fetch", () => jest.fn());

import nodeFetch from "node-fetch";
import { takeScreenshot, ShotsnapError } from "../src/index";

const { Response } = jest.requireActual<typeof import("node-fetch")>("node-fetch");
const fetchMock = nodeFetch as unknown as jest.Mock<(url: string) => Promise<InstanceType<typeof Response>>>;
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

let dir: string;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "shotsnap-"));
  fetchMock.mockReset();
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

/** The hosted API's real 429: a plain-text body and no Retry-After. */
const tooManyRequests = (headers: Record<string, string> = {}) =>
  new Response("Too Many Requests", { status: 429, statusText: "Too Many Requests", headers: { "content-type": "text/plain; charset=utf-8", ...headers } });

describe("takeScreenshot response checks", () => {
  test("rejects a 429 with the status and writes no file", async () => {
    fetchMock.mockResolvedValue(tooManyRequests());
    const fileName = path.join(dir, "shot.png");

    const error = await takeScreenshot({ pageUrl: "https://example.com", saveFile: true, fileName }).catch((e) => e);

    expect(error).toBeInstanceOf(ShotsnapError);
    expect(error.status).toBe(429);
    expect(error.retryAfter).toBeNull();
    expect(error.message).toBe("Screenshot API answered HTTP 429 Too Many Requests");
    expect(fs.existsSync(fileName)).toBe(false);
  });

  test("includes Retry-After when the API sends it", async () => {
    fetchMock.mockResolvedValue(tooManyRequests({ "retry-after": "600" }));
    const error = await takeScreenshot({ pageUrl: "https://example.com", saveFile: false }).catch((e) => e);
    expect(error.retryAfter).toBe("600");
    expect(error.message).toBe("Screenshot API answered HTTP 429 Too Many Requests (Retry-After: 600)");
  });

  test("rejects a 200 that is not an image", async () => {
    fetchMock.mockResolvedValue(new Response("<html></html>", { status: 200, headers: { "content-type": "text/html" } }));
    const fileName = path.join(dir, "shot.png");
    const error = await takeScreenshot({ pageUrl: "https://example.com", saveFile: true, fileName }).catch((e) => e);
    expect(error).toBeInstanceOf(ShotsnapError);
    expect(error.message).toBe("Screenshot API answered HTTP 200 with content-type text/html instead of an image");
    expect(fs.existsSync(fileName)).toBe(false);
  });

  test("returns and saves an image response", async () => {
    fetchMock.mockResolvedValue(new Response(PNG, { status: 200, headers: { "content-type": "image/png" } }));
    const fileName = path.join(dir, "shot.png");
    const image = await takeScreenshot({ pageUrl: "https://example.com", saveFile: true, fileName });
    expect(image.equals(PNG)).toBe(true);
    expect(fs.readFileSync(fileName).equals(PNG)).toBe(true);
  });
});

describe("takeScreenshot request URL", () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(new Response(PNG, { status: 200, headers: { "content-type": "image/png" } }));
  });

  test("encodes a page URL that has its own query string", async () => {
    await takeScreenshot({ pageUrl: "https://example.com/search?q=shoes&page=2", saveFile: false, screenWidth: 1280 });
    expect(fetchMock.mock.calls[0]![0]).toBe(
      "https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dshoes%26page%3D2&width=1280&height=768",
    );
  });

  test("leaves an already encoded page URL alone", async () => {
    await takeScreenshot({ pageUrl: encodeURIComponent("https://example.com/search?q=shoes&page=2"), saveFile: false });
    expect(fetchMock.mock.calls[0]![0]).toBe(
      "https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dshoes%26page%3D2&width=800&height=768",
    );
  });
});
