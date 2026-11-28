---
title: Props
description: "Options of shotsnap takeScreenshot: page URL, screen width and height, saving to a file and the file name."
---

# Props for takeScreenshot

`takeScreenshot` takes a single options object and returns a `Promise` that resolves to a `Buffer` holding the image. These are all the options it reads.

| Prop           | Type      | Required | Default        | Description                                     |
| -------------- | --------- | -------- | -------------- | ----------------------------------------------- |
| `pageUrl`      | `string`  | Yes      | none           | The page URL you want to screenshot             |
| `saveFile`     | `boolean` | Yes      | none           | Writes the image to disk when `true`            |
| `fileName`     | `string`  | No       | `shotsnap.png` | Path of the file written when `saveFile` is set |
| `screenWidth`  | `number`  | No       | `800`          | Viewport width in pixels                        |
| `screenHeight` | `number`  | No       | `768`          | Viewport height in pixels                       |

## pageUrl

The address of the page to capture, including the protocol, such as `https://example.com`. The hosted browser loads it, so it has to be reachable from the public internet.

Shotsnap encodes the value with `encodeURIComponent` before it goes into the request URL, so a page URL with a query string of its own works as is:

```javascript
takeScreenshot({
  pageUrl: "https://example.com/search?q=shoes&page=2",
  saveFile: false,
});
```

A value that is already encoded, one that starts with `https%3A` or `http%3A`, is sent unchanged, so code written for version 0.2.2, which did not encode the value, keeps working.

## saveFile and fileName

With `saveFile: true` the image is written with `fs.writeFile`, so a relative `fileName` is resolved from the current working directory and an existing file with that name is replaced. Without a `fileName`, the file is called `shotsnap.png`. The Buffer is returned either way, so `saveFile: false` is the right choice when you upload or stream the image yourself.

`saveFile` is marked as required in the source. If you leave it out, it behaves like `false`.

## screenWidth and screenHeight

These set the size of the browser viewport the page is rendered in. A missing value, or `0`, falls back to 800 by 768. Use a narrow width such as 390 to see a site's mobile layout.

## Full example

```javascript
const { takeScreenshot } = require("shotsnap");

(async () => {
  const image = await takeScreenshot({
    pageUrl: "https://example.com",
    screenWidth: 1280,
    screenHeight: 800,
    saveFile: true,
    fileName: "screenshots/example.png",
  });
  console.log(image.length);
})();
```

The `screenshots` folder must already exist, because shotsnap does not create directories. See [Getting started](/get-started) for error handling and [Take a screenshot of a URL](/taking-screenshot) for the HTTP endpoint behind these options.
