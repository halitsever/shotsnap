---
title: "chrome-headless-shell: What It Is and When to Use It"
titleTemplate: false
description: "chrome-headless-shell is Chrome's old headless mode as a separate binary. Why it was split out, how to install it, and how Puppeteer and Playwright use it."
headline: "chrome-headless-shell explained: the lighter headless Chrome"
date: "2026-11-28"
keyword: "chrome headless shell"
faq: [{"q": "What is chrome-headless-shell?", "a": "It is Chrome's old headless mode, published as a standalone binary through Chrome for Testing since Chrome 120. Since Chrome 132 it is the only way to get the old mode."}, {"q": "How do I use chrome-headless-shell with Puppeteer?", "a": "Launch with headless: 'shell'. Puppeteer's default, headless: true, uses the new headless Chrome."}]
---

# chrome-headless-shell explained: the lighter headless Chrome

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">chrome-headless-shell is the old headless Chrome, shipped as its own binary. It is not the Chrome browser you know but a lighter program built on Chromium's content module, and Google recommends it for jobs like automated screenshots and scraping.</p>

## Why it exists

Chrome used to contain two headless implementations. `--headless` started the old one, a separate, lighter browser that shared little code with real Chrome. In Chrome 112 a new headless mode arrived (`--headless=new`) that is the real Chrome browser without a window.

To keep both available, Google split the old one out. Per [Chrome's chrome-headless-shell announcement](https://developer.chrome.com/blog/chrome-headless-shell), the standalone binary has been published through Chrome for Testing since Chrome 120. [Chrome's headless docs](https://developer.chrome.com/docs/chromium/headless) add that since Chrome 132.0.6793.0 the old mode is available **only** as `chrome-headless-shell`; `--headless` in Chrome now always means the new mode.

## How it differs from headless Chrome

| | chrome-headless-shell | Chrome with `--headless` |
| --- | --- | --- |
| What it is | A wrapper around Chromium's `//content` module | The real Chrome browser without a window |
| Dependencies | Substantially fewer; no X11 or Wayland, no D-Bus | Those of desktop Chrome |
| Recommended for | Automated screenshots, scraping | High-accuracy end-to-end tests, extension tests |
| Matches what users see | Close, not identical | Yes |

Those recommendations come from Google's announcement. The shell is further from the Chrome your visitors use, but it needs less to run.

## Installing it

With the Puppeteer browsers tool:

```bash
npx @puppeteer/browsers install chrome-headless-shell@stable
```

Chrome for Testing also publishes JSON endpoints with download URLs per version and platform, for scripted installs. The binary takes the same screenshot flags as Chrome:

```bash
./chrome-headless-shell --screenshot=shot.png --window-size=1280,720 https://example.com
```

## Puppeteer and Playwright

**Puppeteer** selects it with the `headless` option:

```js
await puppeteer.launch({ headless: true })     // new headless Chrome, the default
await puppeteer.launch({ headless: 'shell' })  // chrome-headless-shell
await puppeteer.launch({ headless: false })    // a visible window
```

**Playwright** uses a chromium headless shell for headless runs by default, according to its [browsers docs](https://playwright.dev/docs/browsers). To use the new headless mode instead, launch with `channel: 'chromium'`. On CI, `npx playwright install --only-shell` downloads only the shell, and `--no-shell` skips it when you use the new mode.

## Which one for screenshots

- **Screenshots of public pages, many of them, in containers:** the shell. Fewer dependencies and Google's own recommendation for this job.
- **Screenshots that must match what a real Chrome user sees,** or pages that behave differently for automated browsers: new headless Chrome.
- **Serverless functions:** packaged builds such as `@sparticuz/chromium` are built for this; see [screenshots on AWS Lambda](/blog/screenshots-aws-lambda).

## Or no browser at all

[Shotsnap](/) takes the browser off your side entirely: the URL goes to a hosted service and a PNG comes back. It fits occasional captures of public URLs, free with a limit of 7 requests per 10 minutes per IP address, then HTTP 429. See the [free screenshot API](/free-screenshot-api/) page.

## FAQ

### What is chrome-headless-shell?

It is Chrome's old headless mode, published as a standalone binary through Chrome for Testing since Chrome 120. Since Chrome 132 it is the only way to get the old mode.

### How do I use chrome-headless-shell with Puppeteer?

Launch with headless: 'shell'. Puppeteer's default, headless: true, uses the new headless Chrome.

## Related posts

- [What is headless Chrome, and do you need it for screenshots?](/blog/what-is-headless-chrome)
- [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots)
- [Website screenshots on AWS Lambda without bundling Chrome](/blog/screenshots-aws-lambda)
- [All posts](/blog/)
