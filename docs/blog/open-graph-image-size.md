---
title: "Open Graph Image Size: 1200x630 and the Other Limits"
titleTemplate: false
description: "The Open Graph image size to use, from Meta's sharing docs: 1200x630 for sharp previews, 600x315 at minimum, a 1.91:1 ratio, 8 MB at most, and the meta tags."
headline: "What size an og:image should be, and why 1200x630"
date: "2026-11-28"
keyword: "open graph image size"
faq: [{"q": "What is the best Open Graph image size?", "a": "1200x630 pixels. Meta's sharing documentation asks for at least 1200x630 for the best display on high resolution screens, at a ratio close to 1.91:1."}, {"q": "What is the minimum og:image size?", "a": "Meta accepts images down to 200x200 pixels, but says to use at least 600x315 for link posts with a large image. Smaller images show up much smaller."}, {"q": "How large can an og:image file be?", "a": "Meta's limit is 8 MB. Smaller is better in practice, because every platform that builds a preview downloads the file."}]
---

# What size an og:image should be, and why 1200x630

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">The Open Graph protocol says what an og:image is, but not how big it should be. The sizes everyone uses come from the platforms that render link previews, and the most detailed public rules are Meta's. Here they are, with the tags that go with them.</p>

## The numbers

From [Meta's guide to images in link shares](https://developers.facebook.com/docs/sharing/webmasters/images/), read on 28 November 2026:

| Rule | Value |
| --- | --- |
| Recommended size | at least **1200 x 630** pixels, for high resolution screens |
| Smallest size for a large preview | **600 x 315** pixels |
| Smallest size accepted at all | 200 x 200 pixels |
| Aspect ratio | as close to **1.91:1** as possible, to avoid cropping |
| File size | at most **8 MB** |

Below 600 x 315 the image still appears, but Meta says it is shown much smaller. 1200 x 630 is exactly twice 600 x 315, which is why it became the default for almost every site: one image is sharp on high-density screens and meets the minimum everywhere else.

Other platforms publish their own limits and change them from time to time. A 1200 x 630 image with the important content away from the edges is the common choice that works across them; check a platform's own documentation when you target one in particular.

## The tags

```html
<meta property="og:image" content="https://example.com/og/post.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Title of the post on a dark background" />
<meta name="twitter:card" content="summary_large_image" />
```

The [Open Graph protocol](https://ogp.me/) defines `og:image:width`, `og:image:height` and `og:image:alt` as structured properties of `og:image`. Meta's guide adds that giving the dimensions lets its crawler render the image right away instead of processing it first. Use an absolute HTTPS URL.

## Keep it light

8 MB is the ceiling, not a target. A card made of text and flat colour fits in a few dozen kilobytes: the 1200 x 630 PNG card in [our OG image generator post](/blog/og-image-generator) came to 22 KB. A photo is bigger; in [our PNG and WebP tests](/blog/webp-vs-png), a photo-heavy screenshot was 547 KB as PNG and 120 KB as JPEG at quality 80. For photos, JPEG keeps og:image small and is read everywhere.

## Design for the crop

Previews are shown at many sizes, sometimes cropped to a square or shown as a small thumbnail next to the title. Keep text large, keep it away from the edges, and do not repeat the page title in tiny type; the platform shows the title next to the image anyway.

## Getting exactly 1200 x 630

- **From a template:** render HTML at a 1200 x 630 viewport and take a screenshot, as in [generating Open Graph images from HTML](/blog/og-image-generator).
- **From a screenshot of a page:** Shotsnap's [free screenshot API](/free-screenshot-api/) returns images at twice the requested viewport, so `width=600&height=315` gives a 1200 x 630 PNG. The endpoint allows 7 requests per 10 minutes per IP address, so create the image once and host the file rather than pointing og:image at the endpoint.
- **From an existing image:** resize and crop to 1200 x 630, for example with sharp: `sharp(input).resize(1200, 630, { fit: 'cover' }).toFile('og.png')`.

## After you publish

Open the image URL by itself and check that it answers 200 with an image content type. Meta caches images by URL, so its guide says to give a changed image a new URL and to keep the old file online for posts that still reference it. Its Sharing Debugger fetches a page again and shows the preview before anyone shares it; note also that, per the same guide, its crawler only accepts gzip and deflate encodings.

## FAQ

### What is the best Open Graph image size?

1200x630 pixels. Meta's sharing documentation asks for at least 1200x630 for the best display on high resolution screens, at a ratio close to 1.91:1.

### What is the minimum og:image size?

Meta accepts images down to 200x200 pixels, but says to use at least 600x315 for link posts with a large image. Smaller images show up much smaller.

### How large can an og:image file be?

Meta's limit is 8 MB. Smaller is better in practice, because every platform that builds a preview downloads the file.

## Related posts

- [Generating Open Graph images from HTML with a headless browser](/blog/og-image-generator)
- [PNG or WebP for website screenshots?](/blog/webp-vs-png)
- [Free website screenshot API: no key, one URL](/free-screenshot-api/)
- [All posts](/blog/)
