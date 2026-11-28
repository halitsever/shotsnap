---
title: "OG Image Generator: Open Graph Images From HTML"
titleTemplate: false
description: "Build your own OG image generator: an HTML template rendered at 1200x630 with Puppeteer, the og:image meta tags to add, and when a URL screenshot is enough."
headline: "Generating Open Graph images from HTML with a headless browser"
date: "2026-11-28"
keyword: "og image generator"
faq: [{"q": "What size should an Open Graph image be?", "a": "1200x630 pixels is the common choice and keeps a 1.91:1 ratio. The Open Graph protocol itself does not fix a size, so declare the real one with og:image:width and og:image:height."}, {"q": "Can I generate OG images without a design tool?", "a": "Yes. Write the card as HTML and CSS, render it in a headless browser at 1200x630 and save the screenshot. Our test rendered one in about a quarter of a second."}, {"q": "Do OG images have to be PNG?", "a": "No. PNG and JPEG are the safe choices for link previews across platforms. Keep the file small, since crawlers fetch it when a link is shared."}]
---

# Generating Open Graph images from HTML with a headless browser

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">An Open Graph image is the picture that shows up when someone shares your link in a chat app or on social media. Making one per page by hand does not scale, so most sites generate them. The simplest generator is a page template and a headless browser that takes a screenshot of it.</p>

## The tags

The [Open Graph protocol](https://ogp.me/) uses meta tags in the page head. For the image:

```html
<meta property="og:image" content="https://example.com/og/how-to-scroll-up-in-tmux.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="How to scroll up in tmux" />
<meta name="twitter:card" content="summary_large_image" />
```

The protocol lists `og:image:width`, `og:image:height` and `og:image:alt` as optional structured properties. Sending the real size lets a crawler lay out the preview without downloading the image first. The URL must be absolute.

## A generator in 30 lines

Write the card as HTML at exactly the output size, then screenshot it:

```js
import puppeteer from 'puppeteer-core'

const title = 'How to scroll up in tmux'
const html = `<!doctype html><html><head><style>
  body { margin: 0; width: 1200px; height: 630px; display: flex; flex-direction: column; justify-content: center;
         padding: 0 80px; box-sizing: border-box; background: #111827; color: #f9fafb; font-family: system-ui, sans-serif; }
  h1 { font-size: 72px; line-height: 1.1; margin: 0 0 24px; }
  p { font-size: 32px; color: #9ca3af; margin: 0; }
</style></head><body><h1>${title}</h1><p>projects.halit.org</p></body></html>`

const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome' })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630 })
await page.setContent(html, { waitUntil: 'load' })
await page.screenshot({ path: 'og.png' })
await browser.close()
```

On our machine it rendered in 244 ms and wrote a 1200x630 PNG of 22 KB. In a real generator:

- **Escape the title** before putting it into HTML, since titles can contain `<` and `&`.
- **Wait for web fonts** with `await page.evaluate(() => document.fonts.ready)` if the template loads any, or the first render may use a fallback font.
- **Keep the browser open** between images. Launching Chrome costs far more than rendering one card.
- **Generate at build time** where you can. A static site knows every title in advance, and a file on disk needs no browser in production.

## Other ways to make them

| Approach | How it works | Trade-off |
| --- | --- | --- |
| Headless browser (above) | real HTML and CSS, screenshot | needs Chrome where it runs |
| SVG to PNG libraries | build the card as SVG, rasterise | limited layout, no full CSS |
| Edge image functions | a framework turns JSX into an image on request | supports a subset of CSS |
| A design tool export | one image per page by hand | does not scale |

Running Chrome inside serverless functions is the hard part of the first approach; [screenshots on AWS Lambda](/blog/screenshots-aws-lambda) covers the packaging problem.

## Using a screenshot of the page itself

Some sites skip the template and use a screenshot of the page as its preview. Shotsnap's [free screenshot API](/free-screenshot-api/) can do that with a URL, and because it returns twice the viewport, a 600x315 viewport gives exactly 1200x630:

```txt
https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com&width=600&height=315
```

That suits internal tools and link directories. For a public site, a designed card with a large title is usually easier to read at preview size than a shrunken page. Also keep the limit in mind: the free endpoint allows 7 requests per 10 minutes per IP address, so generate each image once and store it instead of pointing `og:image` at the endpoint.

## Checking the result

After deploying, look at the page source for the tags, open the image URL directly to confirm it answers 200 with an image content type, and use a platform's share preview or debugging tool to see the card as that platform renders it. Platforms cache previews, so a fixed image can take a while to show up for links that were already shared.

## FAQ

### What size should an Open Graph image be?

1200x630 pixels is the common choice and keeps a 1.91:1 ratio. The Open Graph protocol itself does not fix a size, so declare the real one with og:image:width and og:image:height.

### Can I generate OG images without a design tool?

Yes. Write the card as HTML and CSS, render it in a headless browser at 1200x630 and save the screenshot. Our test rendered one in about a quarter of a second.

### Do OG images have to be PNG?

No. PNG and JPEG are the safe choices for link previews across platforms. Keep the file small, since crawlers fetch it when a link is shared.

## Related posts

- [Three ways to convert HTML to an image in Node.js](/blog/html-to-image-nodejs)
- [PNG or WebP for website screenshots?](/blog/webp-vs-png)
- [Website screenshots on AWS Lambda without bundling Chrome](/blog/screenshots-aws-lambda)
- [All posts](/blog/)
