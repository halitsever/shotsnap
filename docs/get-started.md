---
title: Getting Started
description: "Install shotsnap to take website screenshots in Node.js through a hosted cloud browser."
---

# Getting started with shotsnap

Shotsnap takes a screenshot of a web page from Node.js and gives it back to you as a `Buffer`. You pass a URL, a hosted browser loads the page, and the image comes back over HTTP. This page covers installing the package, taking a first screenshot and handling the cases where a capture fails.

## Requirements

- Node.js. The CI workflow tests the package on the latest Node.js LTS release.
- Network access to `shotsnap.vercel.app`.
- A public URL to capture. Pages on localhost or a private network are out of reach for the hosted browser.

## Installation

```bash
npm i --save shotsnap
```

Every screenshot is taken by a public cloud browser at shotsnap.vercel.app, so you don't need a browser or webdriver on your machine.

The cloud browser has some limits: it allows 7 requests per 10 minutes per IP address and answers HTTP 429 after that, it has no uptime guarantee, and a site that blocks its IP address can't be captured with it. See the [free screenshot API](/free-screenshot-api/) page for the exact rules.

## Your first screenshot

```javascript
const { takeScreenshot } = require("shotsnap");

(async () => {
  const image = await takeScreenshot({
    pageUrl: "https://example.com",
    saveFile: true,
    fileName: "example.png",
  });
  console.log(`Saved ${image.length} bytes`);
})();
```

The call resolves to a `Buffer` with the image data. With `saveFile: true` the same data is also written to `example.png` in the current working directory. Leave `saveFile` as `false` when you only need the Buffer, for example to upload it somewhere or send it in an HTTP response.

The package also works with `import { takeScreenshot } from "shotsnap"` in ES modules.

## When a capture fails

- **Network errors.** If the request cannot reach the API, the promise rejects with the error from the HTTP client. Wrap the call in `try`/`catch`.
- **Error responses.** If the API answers with an error status, or with a body that is not an image, the promise rejects with a `ShotsnapError` and nothing is written to disk. The error has the HTTP `status`, the `contentType` and the raw `retryAfter` header, which is `null` when the API sends none. The hosted API answers HTTP 429 after 7 requests in 10 minutes and sends no `Retry-After`, so wait out the window before retrying:

```javascript
const { takeScreenshot, ShotsnapError } = require("shotsnap");

try {
  await takeScreenshot({ pageUrl: "https://example.com", saveFile: true, fileName: "example.png" });
} catch (error) {
  if (error instanceof ShotsnapError && error.status === 429) {
    console.log("Rate limited, try again in 10 minutes");
  } else {
    throw error;
  }
}
```

Version 0.2.2 and earlier did not check the status. On a 429 they returned the text `Too Many Requests` as the Buffer and wrote it to the PNG file.

## Next steps

- [Props](/props) lists every option with its type and default.
- [Take a screenshot of a URL](/taking-screenshot) shows a full example and the raw HTTP endpoint.
- [Puppeteer screenshot vs a hosted API](/puppeteer-screenshot) helps you decide whether a local browser suits you better.
