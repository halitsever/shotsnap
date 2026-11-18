---
title: Puppeteer Screenshot vs a Hosted Screenshot API
description: "How to take a screenshot with Puppeteer in Node.js, the same capture with the shotsnap screenshot API, and when each one is the better fit."
---

# Puppeteer screenshot vs a hosted screenshot API

Puppeteer is the usual way to take a website screenshot in Node.js: it starts a real Chrome, loads the page and saves an image. Shotsnap sends the URL to a hosted browser instead and gets a PNG back over HTTP. Both give you an image of the page. They differ in where the browser runs and how much of it you control.

## Taking a screenshot with Puppeteer

```bash
npm i puppeteer
```

Installing `puppeteer` also downloads a recent Chrome for Testing build into `~/.cache/puppeteer`. `puppeteer-core` skips that download, and then you point it at a browser you provide.

```javascript
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 768 });
  await page.goto("https://example.com", { waitUntil: "networkidle2" });
  await page.screenshot({ path: "example.png", fullPage: true });
  await browser.close();
})();
```

`page.screenshot()` resolves to a `Uint8Array`, or to a base64 string with `encoding: "base64"`. Its options include `fullPage`, `clip` for a region of the page, `type` for the image format, `quality` and `omitBackground`. An element handle has its own `screenshot()` for capturing a single element.

## The same screenshot with shotsnap

```bash
npm i shotsnap
```

```javascript
const { takeScreenshot } = require("shotsnap");

(async () => {
  const image = await takeScreenshot({
    pageUrl: "https://example.com",
    screenWidth: 800,
    screenHeight: 768,
    saveFile: true,
    fileName: "example.png",
  });
  console.log(image.length);
})();
```

Nothing launches on your machine. `takeScreenshot` sends the URL and screen size to `https://shotsnap.vercel.app/api/screenshot`, waits for the PNG and returns it as a Buffer. With `saveFile: true` it also writes the image to `fileName`.

## Which one to use

| | Puppeteer | shotsnap |
| --- | --- | --- |
| Where the browser runs | Your machine or server | The hosted API |
| What you install | `puppeteer` and a Chrome download | One small package |
| Capture options | Full page, region, single element, format, quality | URL, width and height |
| Page interaction | Clicks, typing, logins, waiting for selectors | None |
| Output | `Uint8Array` or base64 string | PNG as a Buffer |
| Reachable pages | Anything your machine can open, including localhost | Public URLs only |
| Limits | Your own CPU and memory | Rate limits on heavy use, and sites can block the API's IP address |

Puppeteer is the stronger tool. Use it when you need more than a plain viewport capture: a full-page screenshot, one element, a page behind a login, or a site on localhost or a private network. It also keeps the URL on your own machine instead of sending it to a third-party service.

Shotsnap fits when you only need an image of a public URL at a given size and would rather not ship Chrome, for example in a small script, a chat bot or a serverless function where a browser binary is awkward to bundle. The API sends a one-day cache header, so asking for the same URL and size again can return the earlier image.

See [Take a Screenshot of a URL in Node.js](/taking-screenshot) for the full shotsnap example and [Props](/props) for every option.
