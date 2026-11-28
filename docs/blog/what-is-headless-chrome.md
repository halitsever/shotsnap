---
title: "What Is Headless Chrome? Screenshots From the CLI"
titleTemplate: false
description: "Headless Chrome is Chrome without a window. How to run it, the --screenshot and --print-to-pdf flags, old vs new headless, and when you can skip it."
headline: "What is headless Chrome, and do you need it for screenshots?"
date: "2026-11-28"
keyword: "headless chrome"
faq: [{"q": "What is headless Chrome?", "a": "It is Chrome running without a visible window, controlled from the command line or from code. Since Chrome 112 it is the real Chrome browser; the older separate implementation is now chrome-headless-shell."}, {"q": "How do I take a screenshot with headless Chrome?", "a": "Run google-chrome --headless --screenshot=shot.png --window-size=1280,720 followed by the URL, or use Puppeteer, Playwright or Selenium for anything more."}]
---

# What is headless Chrome, and do you need it for screenshots?

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Headless Chrome is the normal Chrome browser running without a visible window. It loads pages, runs JavaScript and renders exactly as desktop Chrome does, and you control it from the command line or from code. It is what most screenshot tools run under the hood.</p>

## Starting it

Pass `--headless` to the Chrome binary. [Chrome's headless docs](https://developer.chrome.com/docs/chromium/headless) give:

```bash
google-chrome --headless                          # Linux
open -a "Google Chrome" --args --headless         # macOS
start chrome --headless                           # Windows
```

## Screenshots, PDFs and HTML without writing code

A few flags do one job and exit. We ran these with Chrome 157 on Linux:

```bash
google-chrome --headless --screenshot=shot.png --window-size=1280,720 https://example.com
google-chrome --headless --print-to-pdf=page.pdf https://example.com
google-chrome --headless --dump-dom https://example.com > page.html
```

- `--screenshot` wrote a 1280x720 PNG. Without `--window-size`, the same command gave a 780x493 image, so always set the size.
- `--print-to-pdf` wrote a one-page PDF.
- `--dump-dom` printed the HTML after JavaScript ran, which is useful for pages that build their content in the browser.

The flags are fine for a one-off capture. For waiting on elements, clicking, full-page captures or many pages, drive the browser from code with Puppeteer, Playwright or Selenium.

## Old headless and new headless

Chrome used to have two headless implementations. The old one was a separate, lighter browser that shared little code with real Chrome. In Chrome 112 the new headless mode (`--headless=new`) arrived, which is the real Chrome browser without a window. Since Chrome 132.0.6793.0, `--headless` means the new mode, and the old one ships only as a separate binary, `chrome-headless-shell`. [chrome-headless-shell: what it is](/blog/chrome-headless-shell) covers when the old one is still the better pick.

## From code

```js
// Puppeteer: headless is the default
const browser = await puppeteer.launch()               // new headless Chrome
const shell = await puppeteer.launch({ headless: 'shell' }) // chrome-headless-shell
```

```js
// Selenium WebDriver for Node.js
const options = new chrome.Options().addArguments('--headless=new')
```

Tested code for each: [Selenium headless Chrome screenshots](/blog/selenium-headless-chrome-screenshot) and [Playwright vs Puppeteer](/blog/playwright-vs-puppeteer-screenshots).

## What it costs to run

Headless is still a whole browser. You install it (Puppeteer and Playwright download their own builds), it uses memory for every open page, and on Linux servers it needs a set of system libraries. On serverless platforms the binary's size is the first obstacle; [screenshots on AWS Lambda](/blog/screenshots-aws-lambda) goes through the numbers.

## Do you need it for screenshots?

You need your own headless browser when you capture:

- pages behind a login, or on localhost or a private network
- full pages, single elements, or pages after clicks and form input
- many pages, more than a free service allows

You can skip it when you only need an image of a public URL at a given size, now and then. [Shotsnap](/) does that from Node.js with one call, and its endpoint works from any language:

```bash
curl -o example.png "https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com&width=1280&height=720"
```

It runs the browser on a hosted service instead of on your machine, free with a limit of 7 requests per 10 minutes per IP address, then HTTP 429. The [free screenshot API](/free-screenshot-api/) page has the details.

## FAQ

### What is headless Chrome?

It is Chrome running without a visible window, controlled from the command line or from code. Since Chrome 112 it is the real Chrome browser; the older separate implementation is now chrome-headless-shell.

### How do I take a screenshot with headless Chrome?

Run google-chrome --headless --screenshot=shot.png --window-size=1280,720 followed by the URL, or use Puppeteer, Playwright or Selenium for anything more.

## Related posts

- [Selenium with headless Chrome: screenshots that work](/blog/selenium-headless-chrome-screenshot)
- [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots)
- [chrome-headless-shell: what it is and when to use it](/blog/chrome-headless-shell)
- [All posts](/blog/)
