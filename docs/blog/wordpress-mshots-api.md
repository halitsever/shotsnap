---
title: "WordPress mShots API: Free Website Thumbnails"
titleTemplate: false
description: "How the s.wordpress.com/mshots/v1 screenshot URL works: the w, h, vpw and vph parameters, the placeholder image, the 24-hour refresh and its limits."
headline: "How the WordPress mShots API makes free website thumbnails"
date: "2026-11-28"
keyword: "s.wordpress.com/mshots/v1 screenshot api"
faq: [{"q": "Is the WordPress mShots API free to use?", "a": "It is free to request, but it has no published terms or quota for use outside WordPress.com, and it can refuse automated traffic."}, {"q": "Why does mShots return a placeholder image?", "a": "The first request for a URL queues a capture and redirects to a default image. Request the same URL again a few seconds later to get the screenshot."}]
---

# How the WordPress mShots API makes free website thumbnails

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">mShots is the screenshot service WordPress.com uses for site thumbnails. Its URL, s.wordpress.com/mshots/v1/ followed by an encoded page address, returns an image you can use in an img tag. The service is open source, so its parameters and limits can be read from the code.</p>

## The URL

```text
https://s.wordpress.com/mshots/v1/https%3A%2F%2Fexample.com%2F?w=800&h=600
```

Encode the target with `encodeURIComponent`. The source is [Automattic/mShots on GitHub](https://github.com/Automattic/mShots), licensed GPL-2.0. Everything below about parameters comes from its `public_html/class-mshots.php`; the hosted service at s.wordpress.com may be configured differently.

## Parameters

| Parameter | Meaning | Limits in the source |
| --- | --- | --- |
| `w` | Width of the returned image | 20 px up to the captured width |
| `h` | Height of the returned image; cropped from the top | 20 px up to the captured height |
| `vpw` | Browser viewport width | 320 to 3072, default 1280 |
| `vph` | Browser viewport height | 320 to 3072, default 960 |
| `screen_width`, `screen_height` | Screen size reported to the page | width up to 1600, height up to 3600 |
| `scale` | Device scale factor | 1 or 2, default 1 |
| `format` | `jpeg` or `png` | default `jpeg` |
| `color_scheme` | `light` or `dark` | default `light` |
| `requeue` | `true` asks for a fresh capture | |

So `?w=400` gives a 400 px wide thumbnail of a 1280x960 capture, and `?vpw=390&vph=844&w=390` asks for a phone-sized view.

## The first request returns a placeholder

mShots does not render while you wait. For a URL it has not captured yet, it queues the page and answers with a **307 redirect to a default placeholder image** at `s0.wp.com/mshots/v1/default`. Request the same URL again a few seconds later and you get the real screenshot. Code that saves the first response saves the placeholder.

```js
async function mshot(url, w = 800) {
  const src = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${w}`
  for (let i = 0; i < 5; i++) {
    const res = await fetch(src, { redirect: 'manual' })
    if (res.status === 200) return Buffer.from(await res.arrayBuffer())
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error('mShots did not finish in time')
}
```

## Caching and refresh

The source keeps a snapshot for 86,400 seconds (24 hours). After that a request still serves the old image and queues a new capture; `requeue=true` asks for one right away. A site that changes often will show yesterday's version for a while.

## Limits to keep in mind

- **No documented terms or quota for outside use.** The service exists for WordPress.com. From this site's server, a test request on 28 November 2026 got HTTP 403 and then 429, so it may refuse automated traffic.
- **Viewport only.** The source has no full-page option; the capture is the viewport you set with `vpw` and `vph`.
- **JPEG by default**, which blurs text slightly. Add `format=png` for sharp text.
- **Asynchronous.** The redirect-then-retry flow does not suit a request that has to return an image at once.

## A synchronous alternative

[Shotsnap's endpoint](/free-screenshot-api/) renders during the request and returns the PNG in the same response, at twice the requested viewport:

```text
https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com&width=800&height=600
```

It is free with a limit of 7 requests per 10 minutes per IP address, then HTTP 429, and has no uptime guarantee. For thumbnails at volume, run your own browser; [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots) has the code.

## FAQ

### Is the WordPress mShots API free to use?

It is free to request, but it has no published terms or quota for use outside WordPress.com, and it can refuse automated traffic.

### Why does mShots return a placeholder image?

The first request for a URL queues a capture and redirects to a default image. Request the same URL again a few seconds later to get the screenshot.

## Related posts

- [thum.io screenshot API: URL format and free alternatives](/blog/thum-io-alternative)
- [HTML to image in Node.js: three approaches](/blog/html-to-image-nodejs)
- [What is headless Chrome, and do you need it for screenshots?](/blog/what-is-headless-chrome)
- [All posts](/blog/)
