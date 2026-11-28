---
title: "Selenium Headless Chrome Screenshots (Tested)"
titleTemplate: false
description: "Take screenshots with Selenium and headless Chrome in Python and Node.js: the --headless=new flag, why --window-size is not the viewport, and full pages."
headline: "Selenium with headless Chrome: screenshots that work"
date: "2026-11-28"
keyword: "chrome sleenium headless"
faq: [{"q": "How do I run Selenium with headless Chrome?", "a": "Add the --headless=new argument to ChromeOptions before creating the driver. Selenium Manager in Selenium 4.6 and later finds a matching chromedriver for you."}, {"q": "Why is my Selenium screenshot smaller than --window-size?", "a": "The flag sets the browser window, and part of it is the browser's own interface. In our test, 1280x720 gave a 1280x577 screenshot."}]
---

# Selenium with headless Chrome: screenshots that work

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Selenium drives a real browser through WebDriver, and with one Chrome flag that browser runs without a window. Here is a screenshot script we ran in November 2026, what the window-size flag really sets, and how to get full-page captures.</p>

## Python

```python
from selenium import webdriver

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
options.add_argument("--window-size=1280,720")

driver = webdriver.Chrome(options=options)
try:
    driver.get("https://example.com")
    driver.save_screenshot("example.png")
finally:
    driver.quit()
```

Selenium 4.6 and later include Selenium Manager, which finds or downloads a matching `chromedriver`, so there is no driver to install by hand.

## Node.js

The same with the `selenium-webdriver` package. This is the script we ran with selenium-webdriver 4.54.0 and Chrome 157:

```js
import { Builder } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'
import fs from 'node:fs/promises'

const options = new chrome.Options().addArguments('--headless=new', '--window-size=1280,720')
const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build()
try {
  await driver.get('https://example.com')
  await fs.writeFile('example.png', await driver.takeScreenshot(), 'base64')
} finally {
  await driver.quit()
}
```

`takeScreenshot()` returns base64, so write it with the `base64` encoding.

## --headless or --headless=new?

Since Chrome 132, `--headless` already means the new headless mode, which is the real Chrome browser. `--headless=new` also works and gives the same mode on older versions back to Chrome 112, so it is the safer choice in scripts that may meet an older browser. The old implementation is now a separate binary; see [chrome-headless-shell](/blog/chrome-headless-shell).

## --window-size is not the viewport

With `--window-size=1280,720`, our screenshot came out **1280x577**, not 1280x720. The flag sets the size of the browser window, and part of it goes to the browser's own interface, even in headless mode. If you need an exact viewport, size the window larger, or set the viewport through the Chrome DevTools Protocol, or use Puppeteer or Playwright, which set the viewport directly.

## Full-page screenshots

`save_screenshot` captures the viewport. Selenium's Python bindings have `get_full_page_screenshot_as_file`, but only for Firefox. With Chrome, the usual workarounds are:

- resize the window to the page height (`document.body.scrollHeight`) before the screenshot
- call the DevTools command `Page.captureScreenshot` with `captureBeyondViewport` through `driver.execute_cdp_cmd`

Both work but are fiddly. If full pages are the main job, Playwright and Puppeteer do it with `fullPage: true`; see [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots).

## Common flags

| Flag | Why |
| --- | --- |
| `--headless=new` | No window |
| `--window-size=W,H` | Window size (larger than the viewport you need) |
| `--hide-scrollbars` | Keeps scrollbars out of captures |
| `--no-sandbox` | Only when running as root in a container that cannot sandbox; it lowers security |
| `--disable-dev-shm-usage` | For Docker containers with a small `/dev/shm` |

## Without a browser

Selenium is the right tool for testing flows across browsers. For a plain image of a public URL, a browser, a driver and Selenium are a lot of moving parts. [Shotsnap](/) sends the URL to a hosted browser and returns the PNG:

```js
const png = await takeScreenshot({ pageUrl: 'https://example.com', screenWidth: 1280, screenHeight: 720 })
```

It is free with a limit of 7 requests per 10 minutes per IP address, then HTTP 429, and captures the viewport only. See the [free screenshot API](/free-screenshot-api/) page.

## FAQ

### How do I run Selenium with headless Chrome?

Add the --headless=new argument to ChromeOptions before creating the driver. Selenium Manager in Selenium 4.6 and later finds a matching chromedriver for you.

### Why is my Selenium screenshot smaller than --window-size?

The flag sets the browser window, and part of it is the browser's own interface. In our test, 1280x720 gave a 1280x577 screenshot.

## Related posts

- [What is headless Chrome, and do you need it for screenshots?](/blog/what-is-headless-chrome)
- [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots)
- [chrome-headless-shell: what it is and when to use it](/blog/chrome-headless-shell)
- [All posts](/blog/)
