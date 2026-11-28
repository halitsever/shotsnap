---
title: "thum.io Screenshot API: URL Format and Alternatives"
titleTemplate: false
description: "How image.thum.io screenshot URLs work, its options, plans and free allowance, and how it compares with Shotsnap's endpoint and running a browser yourself."
headline: "thum.io screenshot API: URL format and free alternatives"
date: "2026-11-28"
keyword: "image.thum.io screenshot api"
faq: [{"q": "Is the thum.io screenshot API free?", "a": "Partly. Its home page offers up to 1,000 impressions a month free without signing up; beyond that it bills per 10,000 hits with a monthly minimum."}, {"q": "Does thum.io support full-page screenshots?", "a": "Yes, with the fullpage/ option, which its docs list for the Better plan."}]
---

# thum.io screenshot API: URL format and free alternatives

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">thum.io turns a URL into an image with nothing but another URL: put image.thum.io/get/ in front of the page address and use the result as an img src. Here is how its URL format and options work, what is free, and how it compares with Shotsnap and a self-hosted browser.</p>

## The URL format

From [thum.io's URL documentation](https://www.thum.io/documentation/api/url), options go between `/get/` and the target URL:

```text
https://image.thum.io/get/width/600/crop/800/https://example.com
```

The target can also be passed as a parameter, URL-encoded:

```text
https://image.thum.io/get/?url=https%3A%2F%2Fexample.com%2F
```

Because the result is an image URL, you can drop it straight into HTML:

```html
<img src="https://image.thum.io/get/width/600/https://example.com" alt="example.com">
```

## Options

| Option | What it does | Plan |
| --- | --- | --- |
| `width/<px>/` | Thumbnail width, default 600 | All |
| `crop/<px>/` | Screenshot height, default 1200 | All |
| `maxAge/<hours>/` | Refresh the cached image if it is older than this | All |
| `png/` | Always return PNG | All |
| `allowJPG/` | Return JPG when possible (default at 320 px or narrower) | All |
| `noanimate/` | Return the final image without the loading animation | All |
| `fullpage/` | Capture the whole page | Better |
| `wait/<seconds>/` | Wait after load before capturing | Better |
| `viewportWidth/<px>/` | Browser width, up to 2400, default 1200 | Better |
| `iphoneX/`, `galaxys5/` and others | Device emulation | Better |

The same docs describe `/prefetch/` to warm the cache ahead of time and a PDF mode under `/pdfSource/`.

## Plans and the free allowance

thum.io's home page lists, at the time of writing:

- up to 1,000 impressions a month free, without signing up
- **Good:** $2 per 10,000 screenshot hits, $1 monthly minimum, first 1,000 free
- **Better:** $1 per 10,000 hits, $20 monthly minimum, needed for full page, wait, viewport and devices

Paid requests are authenticated either by referer (the page the image is embedded on) or by signed URLs with an expiry, with keys managed in its admin panel. Check thum.io's site for current prices before you build on it.

## Shotsnap's endpoint side by side

[Shotsnap](/) is an npm package that calls its own hosted endpoint. Both can be called without signing up:

| | thum.io | Shotsnap endpoint |
| --- | --- | --- |
| URL form | Options in the path, target last | Query string: `page`, `width`, `height` |
| Free use | 1,000 impressions a month without signup | 7 requests per 10 minutes per IP address, then HTTP 429 |
| Output | PNG or JPG, resized thumbnail | PNG at twice the requested viewport (800x600 gives 1600x1200) |
| Full page, delay, devices | On the Better plan | Not available |
| Embeddable as `<img src>` | Yes | Yes |
| Node.js package | No official one | `shotsnap` |

```text
https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com&width=1280&height=720
```

The [free screenshot API](/free-screenshot-api/) page has a live URL builder and the exact limits. Shotsnap is a free shared endpoint with no uptime guarantee, so it suits scripts, previews and small tools rather than production traffic.

## Running the browser yourself

If you need full-page captures, waits, logins or more volume than any free tier gives, run headless Chrome yourself. [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots) has tested code for both, and [what is headless Chrome](/blog/what-is-headless-chrome) explains what you are installing. The trade-off is the browser: a few hundred megabytes on disk and its own memory, which matters most on [serverless platforms](/blog/screenshots-aws-lambda).

## FAQ

### Is the thum.io screenshot API free?

Partly. Its home page offers up to 1,000 impressions a month free without signing up; beyond that it bills per 10,000 hits with a monthly minimum.

### Does thum.io support full-page screenshots?

Yes, with the fullpage/ option, which its docs list for the Better plan.

## Related posts

- [WordPress mShots API: free website thumbnails](/blog/wordpress-mshots-api)
- [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots)
- [Website screenshots on AWS Lambda without bundling Chrome](/blog/screenshots-aws-lambda)
- [All posts](/blog/)
