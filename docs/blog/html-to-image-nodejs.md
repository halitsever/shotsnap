---
title: "HTML to Image in Node.js: Three Approaches"
titleTemplate: false
description: "Turn HTML into a PNG: DOM-to-canvas libraries in the browser, headless Chrome with Puppeteer or Playwright in Node.js, or a hosted URL screenshot."
headline: "Three ways to convert HTML to an image in Node.js"
date: "2026-11-28"
keyword: "html to image"
faq: [{"q": "How do I convert HTML to an image in Node.js?", "a": "Load the HTML into headless Chrome with Puppeteer or Playwright using page.setContent, then call page.screenshot. Browser libraries such as html2canvas need a DOM and do not run in Node.js on their own."}, {"q": "Can Shotsnap render an HTML string?", "a": "No. Shotsnap captures public URLs. For HTML strings, use a headless browser with setContent."}]
---

# Three ways to convert HTML to an image in Node.js

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">There are three ways to turn HTML into an image, and they differ in where the rendering happens. A browser library redraws the DOM on a canvas, a headless browser renders the page for real, and a hosted service renders a public URL for you. Which one fits depends on whether you start from an HTML string, a live page or a URL.</p>

## 1. In the browser: html-to-image and html2canvas

These libraries run in the visitor's browser and turn a DOM node into an image.

[html-to-image](https://github.com/bubkoo/html-to-image) clones the node, copies the computed styles, inlines fonts and images as data URLs, wraps the result in an SVG `<foreignObject>` and draws it on a canvas:

```js
import { toPng } from 'html-to-image'

const dataUrl = await toPng(document.getElementById('card'))
```

It also has `toJpeg`, `toBlob`, `toSvg`, `toCanvas` and `toPixelData`.

[html2canvas](https://html2canvas.hertzen.com) reads the DOM and styles and paints them on a canvas itself. Its README says the result "may not be 100% accurate" because it does not take a real screenshot, that some CSS properties are not supported, that cross-origin content needs a proxy, and that it is "not suitable to be used in nodejs".

```js
const canvas = await html2canvas(document.body)
```

Use these for "download this chart" or "save this card" buttons. They do not work in Node.js on their own, since there is no DOM to read.

## 2. In Node.js: a headless browser

For server-side rendering of an HTML string, load it into headless Chrome and take a screenshot. With Puppeteer:

```js
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630 })
await page.setContent('<h1 style="font: 64px sans-serif">Hello</h1>')
await page.screenshot({ path: 'card.png' })
await browser.close()
```

The same in Playwright:

```js
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent('<h1 style="font: 64px sans-serif">Hello</h1>')
await page.screenshot({ path: 'card.png' })
await browser.close()
```

We ran both on 28 November 2026 (puppeteer-core 25.19.0, Playwright 1.65.1, Chrome 157). Without `setViewport`, Puppeteer's page is 800x600. This is the accurate option: the image is what Chrome draws, with real fonts, CSS grid, SVG and web fonts. The cost is a browser on the server, a few hundred megabytes and its memory. [What is headless Chrome](/blog/what-is-headless-chrome) explains what you install.

Use `page.setContent` for HTML strings and `page.goto` for URLs. Remote images and fonts in the HTML still load over the network, so wait for them (`waitUntil: 'networkidle0'` in Puppeteer, `'networkidle'` in Playwright) before the screenshot.

## 3. A hosted URL screenshot

If the HTML is already a public web page, a hosted service can render it and send back the image. With [Shotsnap](/):

```js
import { takeScreenshot } from 'shotsnap'

const png = await takeScreenshot({ pageUrl: 'https://example.com', screenWidth: 1200, screenHeight: 630 })
```

There is no browser on your side. Shotsnap renders **URLs, not HTML strings**: it cannot take a snippet you built in memory, only a page reachable on the public internet. The endpoint behind it is free with a limit of 7 requests per 10 minutes per IP address, then HTTP 429; the [free screenshot API](/free-screenshot-api/) page has the details.

## Which one to pick

| You have | Use |
| --- | --- |
| A DOM node in the user's browser | html-to-image |
| An HTML string or template on the server | Puppeteer or Playwright with `setContent` |
| A public URL, low volume, no browser wanted | A hosted URL screenshot such as Shotsnap |
| A public URL at volume, or pages behind a login | Your own headless browser |

For social cards (Open Graph images) generated from templates, the second option is the usual choice, and on serverless platforms the browser's size becomes the main problem; see [screenshots on AWS Lambda](/blog/screenshots-aws-lambda).

## FAQ

### How do I convert HTML to an image in Node.js?

Load the HTML into headless Chrome with Puppeteer or Playwright using page.setContent, then call page.screenshot. Browser libraries such as html2canvas need a DOM and do not run in Node.js on their own.

### Can Shotsnap render an HTML string?

No. Shotsnap captures public URLs. For HTML strings, use a headless browser with setContent.

## Related posts

- [What is headless Chrome, and do you need it for screenshots?](/blog/what-is-headless-chrome)
- [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots)
- [Website screenshots on AWS Lambda without bundling Chrome](/blog/screenshots-aws-lambda)
- [All posts](/blog/)
