---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Website Screenshot API for Node.js
description: "Shotsnap is a website screenshot API for Node.js. Pass a URL, a hosted cloud browser renders the page and you get the PNG back as a Buffer, with no Puppeteer or Chrome to install."

hero:
  name: "Shotsnap"
  text: "Website screenshot API for Node.js"
  tagline: Screenshot any URL from Node.js without installing Puppeteer or Chrome.
  actions:
    - theme: brand
      text: 🐢 Get Started
      link: /get-started
  image:
    src: /favicon.svg
    alt: Shotsnap logo

features:
  - icon: ☁️
    title: Can run on cloud
    details: You don't need webdriver for taking screenshots on web
  - icon: 📸
    title: Simple
    details: Simple & small package for taking screenshot on websites
  - title: Puppeteer screenshot without Chrome
    details: See how a Puppeteer screenshot compares with the hosted API, with code for both
    link: /puppeteer-screenshot
---

## Screenshot a URL in Node.js

Shotsnap sends the URL to a hosted cloud browser at shotsnap.vercel.app, which loads the page and returns a PNG. You get the image as a Buffer and can write it to a file in the same call.

```javascript
import { takeScreenshot } from "shotsnap";

const image = await takeScreenshot({
  pageUrl: "https://example.com",
  saveFile: true,
  fileName: "example.png",
});
```

The same screenshot API answers plain HTTP requests, which the [screenshot guide](/taking-screenshot) covers along with the library.
