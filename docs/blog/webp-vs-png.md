---
title: "WebP vs PNG for Screenshots: Size and Quality Tested"
titleTemplate: false
description: "PNG vs WebP vs JPEG for website screenshots, measured with Puppeteer on three pages: file sizes, transparency, lossless WebP and which format to pick."
headline: "PNG or WebP for website screenshots? We measured both"
date: "2026-11-28"
keyword: "webp vs png"
faq: [{"q": "Is WebP smaller than PNG?", "a": "For screenshots, usually. In our tests lossy WebP at quality 80 was 54 to 85 percent smaller than PNG, and lossless WebP was 29 to 60 percent smaller than PNG with no quality loss."}, {"q": "Does WebP support transparency?", "a": "Yes. A Puppeteer screenshot with omitBackground: true kept its alpha channel as PNG and as WebP. JPEG has no alpha channel."}, {"q": "Should I use WebP or PNG for screenshots?", "a": "WebP for screenshots shown on the web, PNG when the image must be pixel exact, will be edited, or goes to tools that do not read WebP."}]
---

# PNG or WebP for website screenshots? We measured both

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Screenshots are mostly text, flat colour and sharp edges, with the odd photo. That mix behaves differently from the photos most format comparisons use. So we took the same screenshots in PNG, WebP and JPEG with Puppeteer and compared the files.</p>

## The test

puppeteer-core 25.19.0 driving Google Chrome, a 1280x800 viewport, one screenshot of the visible area per format. Three pages: example.com (almost only text), the English Wikipedia article on PNG (text with a few images) and a Wikimedia Commons page dominated by a landscape photo. Lossless WebP was made from the PNG with sharp 0.35, since Puppeteer's WebP output is lossy.

```js
const png = await page.screenshot({ type: 'png' })
const webp = await page.screenshot({ type: 'webp', quality: 80 })
const jpeg = await page.screenshot({ type: 'jpeg', quality: 80 })
const losslessWebp = await sharp(png).webp({ lossless: true }).toBuffer()
```

## Results

| Page | PNG | WebP q80 | WebP q100 | JPEG q80 | Lossless WebP |
| --- | --- | --- | --- | --- | --- |
| example.com (text) | 85 KB | 39 KB | 103 KB | 59 KB | 34 KB |
| Wikipedia article | 263 KB | 108 KB | 205 KB | 155 KB | 133 KB |
| Photo page | 547 KB | 83 KB | 480 KB | 120 KB | 388 KB |

What stands out:

- **Lossless WebP beat PNG every time**: 29 to 60 percent smaller, with identical pixels. On the text page it was even smaller than lossy WebP.
- **Lossy WebP at quality 80 was the smallest overall** on mixed and photo pages, and smaller than JPEG at the same quality setting on all three.
- **Quality 100 is not lossless.** Puppeteer's WebP at quality 100 was bigger than the PNG on the text page and only a little smaller elsewhere. If you want no loss, encode lossless WebP; do not turn the quality up to 100.
- **Photos favour lossy formats a lot**: PNG was more than six times the size of WebP q80 on the photo page.

These are three pages on one machine, not a benchmark, but the pattern matches what the formats are built for.

## Transparency

We rendered a circle on a page with no background and took screenshots with `omitBackground: true`:

| Format | Alpha channel kept |
| --- | --- |
| PNG | yes |
| WebP | yes |
| JPEG | no |

So WebP can replace PNG for cut-out screenshots of components too. JPEG cannot.

## Quality and text

Lossy compression smears sharp edges first, and screenshots are full of them: small text, one-pixel borders, icons. For documentation, bug reports or visual regression tests where every pixel counts, use PNG or lossless WebP. For thumbnails, previews and social images, lossy WebP is the efficient choice.

## Support

Every current major browser displays WebP. The gaps are elsewhere: some image editors, older desktop apps, email clients and upload forms still expect PNG or JPEG. If the screenshot leaves the web, PNG is the safe default.

## What Shotsnap returns

Shotsnap's [free screenshot API](/free-screenshot-api/) returns PNG only, at twice the requested viewport (`width=800&height=600` gives 1600x1200). To serve it as WebP, convert after downloading:

```js
import sharp from 'sharp'

const res = await fetch('https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com&width=800&height=600')
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const png = Buffer.from(await res.arrayBuffer())
await sharp(png).webp({ quality: 80 }).toFile('example.webp')
```

The free endpoint allows 7 requests per 10 minutes per IP address and answers 429 after that, so convert and store the result rather than fetching the same screenshot again.

## FAQ

### Is WebP smaller than PNG?

For screenshots, usually. In our tests lossy WebP at quality 80 was 54 to 85 percent smaller than PNG, and lossless WebP was 29 to 60 percent smaller than PNG with no quality loss.

### Does WebP support transparency?

Yes. A Puppeteer screenshot with omitBackground: true kept its alpha channel as PNG and as WebP. JPEG has no alpha channel.

### Should I use WebP or PNG for screenshots?

WebP for screenshots shown on the web, PNG when the image must be pixel exact, will be edited, or goes to tools that do not read WebP.

## Related posts

- [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots)
- [Generating Open Graph images from HTML](/blog/og-image-generator)
- [Three ways to convert HTML to an image in Node.js](/blog/html-to-image-nodejs)
- [All posts](/blog/)
