---
title: "Website Screenshots on AWS Lambda Without Chrome"
titleTemplate: false
description: "Why headless Chrome is hard on AWS Lambda: the 250 MB package limit, @sparticuz/chromium, container images, and calling a hosted screenshot URL instead."
headline: "Website screenshots on AWS Lambda without bundling Chrome"
date: "2026-11-28"
keyword: "aws lambda chrome headless"
faq: [{"q": "Can you run headless Chrome on AWS Lambda?", "a": "Yes, with a serverless Chromium build such as @sparticuz/chromium in a .zip package (it fits the 250 MB limit compressed) or with a container image of up to 10 GB."}, {"q": "How much memory does headless Chrome need on Lambda?", "a": "@sparticuz/chromium's README asks for at least 512 MB and recommends 1,600 MB or more."}]
---

# Website screenshots on AWS Lambda without bundling Chrome

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Taking a screenshot in a Lambda function means fitting a browser into a platform built for small functions. It can be done, with a compressed Chromium build or a container image, but each path has costs. For simple captures of public pages, calling a screenshot URL avoids the browser entirely.</p>

## The size problem

From the [Lambda quotas page](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html):

| Quota | Value |
| --- | --- |
| .zip deployment package, uploaded directly | 50 MB zipped |
| .zip contents, including layers | 250 MB unzipped |
| Layers per function | 5 |
| Container image | 10 GB uncompressed |
| `/tmp` storage | 512 MB to 10,240 MB |
| Memory | 128 MB to 10,240 MB; one vCPU at 1,769 MB |
| Synchronous response payload | 6 MB |

A full Chrome build with its libraries does not fit in 250 MB comfortably, and the standard `puppeteer` package downloads a browser built for desktop Linux distributions, not for Lambda's runtime image.

## Option 1: @sparticuz/chromium

[@sparticuz/chromium](https://github.com/Sparticuz/chromium) packages Chromium for serverless platforms. Its README gives the numbers: the uncompressed binary is 136,964,856 bytes (130.62 MiB) and the Brotli-compressed file 34,820,408 bytes (33.21 MiB). On the first run it decompresses the browser to `/tmp/chromium`; warm invocations reuse it.

```js
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

export const handler = async (event) => {
  const browser = await puppeteer.launch({
    args: await puppeteer.defaultArgs({ args: chromium.args, headless: 'shell' }),
    executablePath: await chromium.executablePath(),
    headless: 'shell',
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630 })
  await page.goto(event.url, { waitUntil: 'networkidle0' })
  const png = await page.screenshot()
  await browser.close()
  return { statusCode: 200, headers: { 'Content-Type': 'image/png' }, isBase64Encoded: true, body: Buffer.from(png).toString('base64') }
}
```

Points from its README:

- Allocate at least 512 MB of memory; 1,600 MB or more is recommended.
- The npm package contains x64 binaries only. For arm64, use `@sparticuz/chromium-min` with the binary from a Lambda layer or a URL.
- It follows Chromium's versions, not semantic versioning, and has to match your `puppeteer-core` version; the README points to Puppeteer's Chromium support table.

## Option 2: a container image

Lambda accepts container images up to 10 GB, enough for a normal Chrome or Playwright image. You trade the size limit for image builds, pushes to ECR and slower cold starts with a large image. It suits teams already deploying containers.

## Things that bite in both

- **Cold starts.** The browser has to start (and, with sparticuz, decompress) before the first screenshot.
- **The 6 MB response limit.** A full-page PNG, base64-encoded, passes 6 MB quickly. Upload to S3 and return a URL instead.
- **Fonts.** Lambda images have few fonts; pages in other scripts or with emoji may render with boxes until you add fonts.

## Option 3: no browser in the function

If the pages are public and the volume is small, the function can fetch an image from a screenshot URL instead of running a browser. With [Shotsnap](/) the dependency is a few kilobytes:

```js
import { takeScreenshot } from 'shotsnap'

export const handler = async (event) => {
  const png = await takeScreenshot({ pageUrl: encodeURIComponent(event.url), screenWidth: 1200, screenHeight: 630 })
  if (png.subarray(0, 4).toString('hex') !== '89504e47') throw new Error(png.toString('utf8', 0, 200))
  return { statusCode: 200, headers: { 'Content-Type': 'image/png' }, isBase64Encoded: true, body: png.toString('base64') }
}
```

Two details in that code come from the library's source: it does not encode `pageUrl`, so encode URLs that have their own query string, and it does not check the HTTP status, so the PNG signature check catches an error body (such as a 429) before it is returned as an image.

The limits are real: the endpoint allows 7 requests per 10 minutes per IP address, then HTTP 429, which is about 1,000 a day, and Lambda's outbound IP addresses are assigned by AWS, so you cannot count on having that quota to yourself. It captures the viewport only, at twice the size you ask for. It is a free shared service with no uptime guarantee. See the [free screenshot API](/free-screenshot-api/) page for details, and use option 1 or 2 for anything production-critical.

## FAQ

### Can you run headless Chrome on AWS Lambda?

Yes, with a serverless Chromium build such as @sparticuz/chromium in a .zip package (it fits the 250 MB limit compressed) or with a container image of up to 10 GB.

### How much memory does headless Chrome need on Lambda?

@sparticuz/chromium's README asks for at least 512 MB and recommends 1,600 MB or more.

## Related posts

- [thum.io screenshot API: URL format and free alternatives](/blog/thum-io-alternative)
- [HTML to image in Node.js: three approaches](/blog/html-to-image-nodejs)
- [chrome-headless-shell: what it is and when to use it](/blog/chrome-headless-shell)
- [All posts](/blog/)
