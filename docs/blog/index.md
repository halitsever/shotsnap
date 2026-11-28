---
title: "Website Screenshot Guides for Node.js | Shotsnap"
titleTemplate: false
description: "Guides to website screenshots from code: headless Chrome, Selenium, Playwright vs Puppeteer, HTML to image, serverless, thum.io and WordPress mShots."
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
