---
title: "Free Website Screenshot API: No Key, URL Parameter"
titleTemplate: false
description: "A free website screenshot API with no key: pass the page URL, width and height as query parameters and get a PNG back. 7 requests per 10 minutes per IP."
aside: false
faq:
  - q: "Is this screenshot API really free?"
    a: "Yes, with a limit: 7 requests per 10 minutes per IP address, then HTTP 429. That is about 1,000 a day per address. It is a free shared endpoint with no uptime guarantee and no paid plan."
  - q: "Do I need an API key?"
    a: "No. There is no sign-up and no key. The limit is applied per IP address."
  - q: "Can I put the target URL in the path instead of a query parameter?"
    a: "No. The endpoint reads the page, width and height query parameters only. Path-style URLs are not supported."
  - q: "Does it take full-page screenshots?"
    a: "No. It captures the viewport you ask for, at twice the size: width=800 and height=600 return a 1600x1200 PNG. For full pages, run Puppeteer or Playwright yourself."
  - q: "Can I call it from JavaScript in the browser?"
    a: "As an img src, yes. Reading the response with fetch from another site does not work, because the endpoint sends no Access-Control-Allow-Origin header."
---

<script setup>
import ScreenshotDemo from '../.vitepress/theme/ScreenshotDemo.vue'
</script>

# Free website screenshot API: no key, one URL

Put a page address, a width and a height into one URL and get a PNG screenshot back. There is no sign-up and no API key. It is the endpoint behind the [Shotsnap](/) npm package, and any language that can send a GET request can use it.

```text
https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com&width=1280&height=720
```

<ScreenshotDemo />

## The limit

| | |
| --- | --- |
| Requests | **7 per 10 minutes per IP address**, in fixed 10-minute windows |
| Over the limit | HTTP **429** until the window resets |
| Per day | About 1,000 per IP address (7 x 144 windows); there is no separate daily cap |
| Service | A free, shared endpoint with **no uptime guarantee** |

It is not unlimited, and it is not meant for production traffic you depend on. For a few screenshots in a script, a chat bot, a preview or a weekend project, it saves you running a browser. For more, run your own; see [when to use something else](#when-to-use-something-else).

## Parameters

| Parameter | Required | Meaning |
| --- | --- | --- |
| `page` | Yes | The URL to capture. Percent-encode it, especially when it has its own `?` or `&`. |
| `width` | No | Viewport width in CSS pixels. |
| `height` | No | Viewport height in CSS pixels. |

What we measured on 28 November 2026:

- The PNG is **twice the viewport**: `width=800&height=600` returned 1600x1200, `width=1280&height=720` returned 2560x1440.
- Without `width` and `height` the image was 1440x960, a 720x480 viewport. The npm package always sends 800x768 unless you set the size.
- Only the viewport is captured. A long page at 800x600 still came back 1600x1200, not the full page.
- Responses took between about 0.8 and 2.6 seconds.
- Successful responses carry `Cache-Control: public, immutable, max-age=86400`, so the same URL can return the same image for up to a day.

**Query parameters only.** Path-style URLs such as `/api/screenshot/https://example.com` are not supported. [Redirect services with the target URL in the path](https://projects.halit.org/suparedirect/blog/redirect-service-url-in-path) explains why that form breaks easily.

## Code

**curl:**

```bash
curl -f -o example.png "https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com&width=1280&height=720"
```

`-f` makes curl fail on a 429 instead of saving the error text as `example.png`.

**JavaScript (Node.js 18+):**

```js
import fs from 'node:fs/promises'

const params = new URLSearchParams({ page: 'https://example.com', width: '1280', height: '720' })
const res = await fetch(`https://shotsnap.vercel.app/api/screenshot?${params}`)
if (res.status === 429) throw new Error('Rate limited: 7 requests per 10 minutes per IP. Try again later.')
if (!res.ok) throw new Error(`HTTP ${res.status}`)
await fs.writeFile('example.png', Buffer.from(await res.arrayBuffer()))
```

**Python (standard library):**

```python
import urllib.error
import urllib.parse
import urllib.request

query = urllib.parse.urlencode({"page": "https://example.com", "width": 1280, "height": 720})
try:
    with urllib.request.urlopen(f"https://shotsnap.vercel.app/api/screenshot?{query}", timeout=60) as r:
        with open("example.png", "wb") as f:
            f.write(r.read())
except urllib.error.HTTPError as e:
    if e.code == 429:
        print("Rate limited: 7 requests per 10 minutes per IP. Try again later.")
    else:
        raise
```

**HTML:**

```html
<img src="https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com&width=1280&height=720"
     width="1280" height="720" alt="Screenshot of example.com">
```

The endpoint sends no `Access-Control-Allow-Origin` header, so a browser cannot read the response with `fetch` from another site. An `<img>` tag works, and so does any server-side code. Each page view that loads the image counts against the viewer's own IP address.

All three snippets were run on 28 November 2026.

## The npm package

[Shotsnap](/) wraps the endpoint for Node.js and returns a `Buffer`:

```js
import { takeScreenshot } from 'shotsnap'

const png = await takeScreenshot({ pageUrl: 'https://example.com', screenWidth: 1280, screenHeight: 720, saveFile: true, fileName: 'example.png' })
```

Two things to know from its source: it does not encode `pageUrl`, so pass `encodeURIComponent(url)` for URLs with their own query string, and it does not check the HTTP status, so after a 429 the Buffer holds the error text. [Getting started](/get-started#when-a-capture-fails) shows a PNG signature check, and [Props](/props) lists every option.

## When to use something else

- **More than a few hundred captures a day, or anything production depends on:** run a browser yourself with [Playwright or Puppeteer](/blog/playwright-vs-puppeteer-screenshots).
- **Full pages, single elements, clicks, logins, localhost:** the endpoint cannot do these. A headless browser can; see [what is headless Chrome](/blog/what-is-headless-chrome).
- **Serverless functions with a browser:** [screenshots on AWS Lambda](/blog/screenshots-aws-lambda) compares the options.
- **Hosted alternatives with paid plans:** [thum.io](/blog/thum-io-alternative) has a free allowance and options such as full page on its paid plans. [WordPress mShots](/blog/wordpress-mshots-api) is free but asynchronous.

## FAQ

### Is this screenshot API really free?

Yes, with a limit: 7 requests per 10 minutes per IP address, then HTTP 429. That is about 1,000 a day per address. It is a free shared endpoint with no uptime guarantee and no paid plan.

### Do I need an API key?

No. There is no sign-up and no key. The limit is applied per IP address.

### Can I put the target URL in the path instead of a query parameter?

No. The endpoint reads the `page`, `width` and `height` query parameters only. Path-style URLs are not supported.

### Does it take full-page screenshots?

No. It captures the viewport you ask for, at twice the size: `width=800` and `height=600` return a 1600x1200 PNG. For full pages, run Puppeteer or Playwright yourself.

### Can I call it from JavaScript in the browser?

As an `img` src, yes. Reading the response with `fetch` from another site does not work, because the endpoint sends no `Access-Control-Allow-Origin` header.
