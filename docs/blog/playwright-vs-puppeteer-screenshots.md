---
title: "Playwright vs Puppeteer for Screenshots (Tested)"
titleTemplate: false
description: "Screenshot code for Playwright and Puppeteer side by side: viewport, full page, elements, JPEG, HTML strings and Playwright's screenshot CLI, all tested."
headline: "Playwright vs Puppeteer for screenshots"
date: "2026-11-28"
keyword: "playwright screenshot image generation node.js cli vs puppeteer comparison 2025"
faq: [{"q": "Is Playwright or Puppeteer better for screenshots?", "a": "Their screenshot APIs are nearly the same. Playwright adds Firefox and WebKit, auto-waiting locators and a screenshot CLI; Puppeteer is a good fit if you only need Chrome."}, {"q": "How do I take a full-page screenshot in Playwright?", "a": "Call page.screenshot({ path: 'full.png', fullPage: true }), or run npx playwright screenshot --full-page followed by the URL and file name."}]
---

# Playwright vs Puppeteer for screenshots

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">For screenshots, Playwright and Puppeteer are close: the same page.screenshot call with almost the same options. They differ in which browsers they drive, how they install them, and in Playwright's command-line screenshot tool. Every snippet here was run on 28 November 2026 with Playwright 1.65.1, puppeteer-core 25.19.0 and Chrome 157.</p>

## The same capture in both

**Puppeteer:**

```js
import puppeteer from 'puppeteer'

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 720 })
await page.goto('https://en.wikipedia.org/wiki/Screenshot', { waitUntil: 'networkidle0' })
await page.screenshot({ path: 'full.png', fullPage: true })
await (await page.$('h1')).screenshot({ path: 'title.png' })
await browser.close()
```

**Playwright:**

```js
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await page.goto('https://en.wikipedia.org/wiki/Screenshot')
await page.screenshot({ path: 'full.png', fullPage: true })
await page.locator('h1').screenshot({ path: 'title.png' })
await browser.close()
```

Both full-page images came out 1280x4487 and both heading crops about 607x40 px.

## Options compared

| Need | Puppeteer | Playwright |
| --- | --- | --- |
| Viewport | `page.setViewport()` (default 800x600) | `viewport` option on the page or context (default 1280x720) |
| Full page | `fullPage: true` | `fullPage: true` |
| One element | `elementHandle.screenshot()` | `locator.screenshot()` |
| Region | `clip: { x, y, width, height }` | `clip: { x, y, width, height }` |
| JPEG and quality | `type: 'jpeg', quality: 80` | `type: 'jpeg', quality: 80` (or a `.jpg` path) |
| Transparent background | `omitBackground: true` | `omitBackground: true` |
| HTML string | `page.setContent(html)` | `page.setContent(html)` |
| Waiting | `waitUntil`, `waitForSelector` | Auto-waiting locators, `waitUntil` |
| Browsers | Chrome and Firefox | Chromium, Firefox, WebKit |

Playwright's `locator.screenshot()` waits for the element to be visible on its own; in Puppeteer you wait first with `waitForSelector`.

## Playwright's screenshot CLI

Playwright can take a screenshot without a script:

```bash
npx playwright screenshot --viewport-size=1280,720 --full-page https://en.wikipedia.org/wiki/Screenshot full.png
```

Other useful flags include `--wait-for-selector`, `--wait-for-timeout`, `--device "iPhone 11"`, `--color-scheme dark` and `--channel chrome` to use an installed Chrome. Puppeteer has no equivalent; the closest is Chrome's own `--headless --screenshot` flag, covered in [what is headless Chrome](/blog/what-is-headless-chrome).

## Installing the browser

- `npm i puppeteer` downloads a Chrome for Testing build into a cache folder. `puppeteer-core` downloads nothing and needs `executablePath`.
- `npm i playwright` (or `@playwright/test`) then `npx playwright install chromium`. Playwright's docs say it uses a separate chromium headless shell for headless runs by default, and `npx playwright install --only-shell` skips the full Chromium download on CI.

Both add a browser of a few hundred megabytes to your machine or image. [chrome-headless-shell](/blog/chrome-headless-shell) explains the lighter headless build both can use.

## Which to choose

- Already on Puppeteer, or only need Chrome: stay with Puppeteer; screenshots are not a reason to switch.
- Need Firefox and WebKit, or want auto-waiting and the CLI: Playwright.
- A test suite already uses one of them: take screenshots with that one.

No speed numbers here: they depend on the page, the machine and the browser build more than on the library, so measure on your own pages if it matters.

## When neither is needed

For an occasional image of a public URL at a set size, [Shotsnap](/) skips the browser install and sends the URL to a hosted browser. The [Puppeteer comparison page](/puppeteer-screenshot) shows when each fits, and the endpoint behind it is free with a limit of 7 requests per 10 minutes per IP address, then HTTP 429. See the [free screenshot API](/free-screenshot-api/) page.

## FAQ

### Is Playwright or Puppeteer better for screenshots?

Their screenshot APIs are nearly the same. Playwright adds Firefox and WebKit, auto-waiting locators and a screenshot CLI; Puppeteer is a good fit if you only need Chrome.

### How do I take a full-page screenshot in Playwright?

Call page.screenshot({ path: 'full.png', fullPage: true }), or run npx playwright screenshot --full-page followed by the URL and file name.

## Related posts

- [HTML to image in Node.js: three approaches](/blog/html-to-image-nodejs)
- [Selenium with headless Chrome: screenshots that work](/blog/selenium-headless-chrome-screenshot)
- [chrome-headless-shell: what it is and when to use it](/blog/chrome-headless-shell)
- [All posts](/blog/)
