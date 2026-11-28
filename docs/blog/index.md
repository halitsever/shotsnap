---
title: "Website Screenshot Guides for Node.js | Shotsnap"
titleTemplate: false
description: "Guides to website screenshots from code: headless Chrome, Puppeteer waitUntil, WebP vs PNG, OG images, 429 rate limits, serverless, thum.io and mShots."
---

# Shotsnap blog

<p class="lead">Practical notes on turning web pages into images: running a headless browser yourself, the hosted screenshot URLs people use instead, and where Shotsnap fits. The code in these posts was run before it was published, and the numbers come from those runs.</p>

## [thum.io screenshot API: URL format and free alternatives](/blog/thum-io-alternative)

How image.thum.io screenshot URLs work, its options, plans and free allowance, and how it compares with Shotsnap's endpoint and running a browser yourself.

## [WordPress mShots API: free website thumbnails](/blog/wordpress-mshots-api)

How the s.wordpress.com/mshots/v1 screenshot URL works: the w, h, vpw and vph parameters, the placeholder image, the 24-hour refresh and its limits.

## [HTML to image in Node.js: three approaches](/blog/html-to-image-nodejs)

Turn HTML into a PNG: DOM-to-canvas libraries in the browser, headless Chrome with Puppeteer or Playwright in Node.js, or a hosted URL screenshot.

## [What is headless Chrome, and do you need it for screenshots?](/blog/what-is-headless-chrome)

Headless Chrome is Chrome without a window. How to run it, the --screenshot and --print-to-pdf flags, old vs new headless, and when you can skip it.

## [Selenium with headless Chrome: screenshots that work](/blog/selenium-headless-chrome-screenshot)

Take screenshots with Selenium and headless Chrome in Python and Node.js: the --headless=new flag, why --window-size is not the viewport, and full pages.

## [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots)

Screenshot code for Playwright and Puppeteer side by side: viewport, full page, elements, JPEG, HTML strings and Playwright's screenshot CLI, all tested.

## [chrome-headless-shell: what it is and when to use it](/blog/chrome-headless-shell)

chrome-headless-shell is Chrome's old headless mode as a separate binary. Why it was split out, how to install it, and how Puppeteer and Playwright use it.

## [Website screenshots on AWS Lambda without bundling Chrome](/blog/screenshots-aws-lambda)

Why headless Chrome is hard on AWS Lambda: the 250 MB package limit, @sparticuz/chromium, container images, and calling a hosted screenshot URL instead.

## [HTTP 429 Too Many Requests, from both sides of the limit](/blog/http-429-too-many-requests)

What HTTP 429 Too Many Requests means, why a server sends it, how to retry without making it worse, and how to handle it when calling a screenshot API.

## [Reading and sending the Retry-After HTTP header](/blog/retry-after-header)

How the Retry-After header works with 429, 503 and redirects: its two formats, how to parse both in JavaScript, and what to do when a server leaves it out.

## [PNG or WebP for website screenshots? We measured both](/blog/webp-vs-png)

PNG vs WebP vs JPEG for website screenshots, measured with Puppeteer on three pages: file sizes, transparency, lossless WebP and which format to pick.

## [Choosing a Puppeteer waitUntil value before a screenshot](/blog/puppeteer-waituntil)

What Puppeteer's waitUntil values load, domcontentloaded, networkidle0 and networkidle2 wait for, measured on a test page, and how to wait for the content.

## [Generating Open Graph images from HTML with a headless browser](/blog/og-image-generator)

Build your own OG image generator: an HTML template rendered at 1200x630 with Puppeteer, the og:image meta tags to add, and when a URL screenshot is enough.

## [What size an og:image should be, and why 1200x630](/blog/open-graph-image-size)

The Open Graph image size to use, from Meta's sharing docs: 1200x630 for sharp previews, 600x315 at minimum, a 1.91:1 ratio, 8 MB at most, and the meta tags.
