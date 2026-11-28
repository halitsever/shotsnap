---
title: "Puppeteer waitUntil: load, networkidle0 and networkidle2"
titleTemplate: false
description: "What Puppeteer's waitUntil values load, domcontentloaded, networkidle0 and networkidle2 wait for, measured on a test page, and how to wait for the content."
headline: "Choosing a Puppeteer waitUntil value before a screenshot"
date: "2026-11-28"
keyword: "puppeteer waituntil"
faq: [{"q": "What is the default waitUntil in Puppeteer?", "a": "load. page.goto resolves when the load event fires, which means images and stylesheets have loaded but data fetched later by scripts may not have."}, {"q": "What is the difference between networkidle0 and networkidle2?", "a": "networkidle0 waits until there are no network connections for at least 500 ms. networkidle2 allows up to two open connections for 500 ms."}, {"q": "Why does networkidle0 time out?", "a": "The page never goes quiet: polling, analytics beacons, long-lived connections or streaming keep a request open, so the 500 ms without traffic never happens."}]
---

# Choosing a Puppeteer waitUntil value before a screenshot

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">The most common bad screenshot is one taken too early: a spinner where the prices should be, a grey box where the image should be. In Puppeteer, the first thing that decides when you shoot is the `waitUntil` option of `page.goto`. We measured all four values against one test page with slow content.</p>

## The four values

From the type definitions of puppeteer-core 25.19.0:

| Value | Resolves when |
| --- | --- |
| `domcontentloaded` | the `DOMContentLoaded` event fires: HTML parsed, images may still be loading |
| `load` (default) | the `load` event fires: images, stylesheets and scripts loaded |
| `networkidle2` | no more than 2 network connections for at least 500 ms |
| `networkidle0` | no network connections for at least 500 ms |

You can also pass an array, such as `['load', 'networkidle2']`, and Puppeteer waits for all of them. The default timeout is 30 seconds, after which `goto` throws.

## The test page

A local Express page with three things on it: an image that takes 1.5 seconds to arrive, a price list a script fetches 0.1 seconds after load from an endpoint that takes 2.5 seconds, and a script that polls another endpoint every 300 ms, the way chat widgets and dashboards do. For each value we called `page.goto` and then checked what was on the page:

| waitUntil | Returned after | Image loaded | Prices shown |
| --- | --- | --- | --- |
| `domcontentloaded` | 112 ms | no | no |
| `load` | 1,573 ms | yes | no |
| `networkidle2` | 2,106 ms | yes | no |
| `networkidle0` | timed out after 15 s | | |

Three lessons:

1. `load` waits for the image, but not for data a script fetches after load.
2. `networkidle2` tolerates two open connections. Here those were the poll and the slow price request, so it went idle while the prices were still loading.
3. `networkidle0` never resolved, because the polling never stopped. Real sites with analytics, websockets or live chat often behave the same.

## Wait for the content, not the network

The fix that worked was to wait for the thing you want in the picture:

```js
await page.goto(url, { waitUntil: 'load' })
await page.waitForFunction(() => document.querySelector('#prices').textContent !== 'loading...')
await page.screenshot({ path: 'shop.png' })
```

On the test page this returned after 2,772 ms with the prices on screen. When the element only appears once its data is ready, `waitForSelector` is the simpler version:

```js
await page.waitForSelector('.price-list li', { visible: true })
```

Note that `waitForSelector('#prices')` alone was not enough here: the element existed from the start with `loading...` in it, so the wait returned at once. Wait for a selector that only exists in the finished state, or check the text.

## Rules of thumb

- **Static pages and most screenshots:** `load`, the default.
- **Pages that load data after the first paint:** `load` plus `waitForSelector` or `waitForFunction` on the real content.
- **Single-page apps with few background requests:** `networkidle2` is a reasonable catch-all, with a timeout you can live with.
- **`networkidle0`:** only for pages you control and know go fully quiet.
- **Fonts:** `await page.evaluate(() => document.fonts.ready)` before the screenshot avoids a fallback font flashing into the image.

## setContent is different

`page.setContent(html, options)` takes the same option, but in puppeteer-core 25.19.0 its TypeScript type only allows `load` and `domcontentloaded`. Passing `networkidle0` is a type error in TypeScript. In plain JavaScript a fresh page still accepted it in our run and returned after about 1.9 seconds, but you are outside the typed API. For HTML strings, wait for `load` and then for fonts or elements as above.

## Or skip the waiting

Shotsnap's [free screenshot API](/free-screenshot-api/) runs the browser for you: you pass a URL and a viewport and get a PNG of what the page shows at capture time. You do not get to choose a wait condition, which is the trade-off for not running Chrome yourself. For pages that need a specific element before the shot, run Puppeteer yourself; [Puppeteer or a hosted API](/puppeteer-screenshot.html) walks through the choice.

## FAQ

### What is the default waitUntil in Puppeteer?

load. page.goto resolves when the load event fires, which means images and stylesheets have loaded but data fetched later by scripts may not have.

### What is the difference between networkidle0 and networkidle2?

networkidle0 waits until there are no network connections for at least 500 ms. networkidle2 allows up to two open connections for 500 ms.

### Why does networkidle0 time out?

The page never goes quiet: polling, analytics beacons, long-lived connections or streaming keep a request open, so the 500 ms without traffic never happens.

## Related posts

- [Should you use Puppeteer or a hosted screenshot API?](/puppeteer-screenshot.html)
- [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots)
- [What is headless Chrome?](/blog/what-is-headless-chrome)
- [All posts](/blog/)
