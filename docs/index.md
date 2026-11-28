---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Website Screenshot API for Node.js
description: "Shotsnap is a website screenshot API for Node.js: pass a URL, a hosted browser renders it and you get a PNG back as a Buffer. No Puppeteer or Chrome needed."

hero:
  name: "Shotsnap"
  text: "Website screenshot API for Node.js"
  tagline: Screenshot any URL from Node.js without installing Puppeteer or Chrome.
  actions:
    - theme: brand
      text: 🐢 Get Started
      link: /get-started
  image:
    src: /favicon.svg
    alt: Shotsnap logo

features:
  - icon: ☁️
    title: Can run on cloud
    details: You don't need webdriver for taking screenshots on web
  - icon: 📸
    title: Simple
    details: Simple & small package for taking screenshot on websites
  - title: Puppeteer screenshot without Chrome
    details: See how a Puppeteer screenshot compares with the hosted API, with code for both
    link: /puppeteer-screenshot
  - title: Free screenshot API, no key
    details: Call the endpoint from any language with a page URL, width and height. 7 requests per 10 minutes per IP
    link: /free-screenshot-api/
  - title: Blog
    details: Headless Chrome, Selenium, Playwright vs Puppeteer, HTML to image and screenshots on AWS Lambda
    link: /blog/
---

## Screenshot a URL in Node.js

Shotsnap sends the URL to a hosted cloud browser at shotsnap.vercel.app, which loads the page and returns a PNG. You get the image as a Buffer and can write it to a file in the same call.

```javascript
import { takeScreenshot } from "shotsnap";

const image = await takeScreenshot({
  pageUrl: "https://example.com",
  saveFile: true,
  fileName: "example.png",
});
```

The same screenshot API answers plain HTTP requests, which the [screenshot guide](/taking-screenshot) covers along with the library.

## When to use it

Shotsnap fits jobs where you need a picture of a public web page and nothing more: a link preview in a chat bot, a thumbnail for a bookmark list, a visual record in a small script or a serverless function where bundling a browser binary is awkward. The package exports a single function, so there is little to learn.

If you need to click, log in, capture a single element or reach a site on localhost, run a browser yourself. The [Puppeteer comparison](/puppeteer-screenshot) shows both approaches side by side.

## How it works

`takeScreenshot` builds a GET request to `https://shotsnap.vercel.app/api/screenshot` with the page URL and the screen size, then waits for the response. The browser runs on the hosted service, not on your machine. When the image arrives, the function turns it into a Node.js `Buffer`. With `saveFile: true` it also writes the Buffer to disk before returning it.

| Option         | Default        | Purpose                          |
| -------------- | -------------- | -------------------------------- |
| `pageUrl`      | none           | The page to capture              |
| `screenWidth`  | `800`          | Viewport width in pixels         |
| `screenHeight` | `768`          | Viewport height in pixels        |
| `saveFile`     | none           | Write the image to disk when set |
| `fileName`     | `shotsnap.png` | Where the image is written       |

The [Props page](/props) describes each option in detail.

## Things to know

- Every call depends on the hosted API, a free shared service with no uptime guarantee. It allows 7 requests per 10 minutes per IP address and answers HTTP 429 after that, and some sites block the API's IP address. The [free screenshot API](/free-screenshot-api/) page has the details.
- Only public URLs work, because the page is loaded from the hosted service.
- The package is written in TypeScript, compiled to CommonJS, and works from both `require` and `import`.

Ready to try it? Start with [Getting Started](/get-started).
