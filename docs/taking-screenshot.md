---
title: Take a Screenshot of a URL in Node.js
description: "Take a screenshot of a website from its URL in Node.js with shotsnap, save it to a PNG file, or call the website screenshot API over HTTP."
---

# Take a screenshot of a URL in Node.js

**Simple example**

```javascript
// import the module
const shotSnap = require("shotsnap");
// take screenshot
shotSnap.takeScreenshot({
  pageUrl: "https://google.com",
  saveFile: true,
  fileName: "test.png",
});
```

**Result:**
<img src="https://i.ibb.co/W6JKvnz/screenshot-1.png" alt="Screenshot of the Google homepage captured by shotsnap from https://google.com" style="border-radius:20px;"/>

**How it works?**
When you run this code this requests going to browser on cloud, its creates a new browser instance and take a screenshot.
The endpoint allows 7 requests per 10 minutes per IP address and answers HTTP 429 after that.

## Calling the website screenshot API over HTTP

`takeScreenshot` is a thin wrapper around a public endpoint, so any language that can send a GET request can turn a URL into a screenshot:

```bash
curl -o example.png "https://shotsnap.vercel.app/api/screenshot?page=https://example.com&width=800&height=768"
```

| Parameter | Meaning |
| --- | --- |
| `page` | The URL to capture. URL-encode it when it has a query string of its own. |
| `width` | Viewport width in pixels. The Node.js library sends 800 when you leave it out. |
| `height` | Viewport height in pixels. The Node.js library sends 768 when you leave it out. |

The response is a PNG at twice the requested viewport. It carries a one-day cache header, so the same URL and size can come back as a cached image. The [free screenshot API](/free-screenshot-api/) page has a live URL builder, the rate limit and snippets for curl, JavaScript and Python.

Comparing this with running a browser yourself? See [Puppeteer screenshot vs a hosted screenshot API](/puppeteer-screenshot).
