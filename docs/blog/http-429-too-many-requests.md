---
title: "429 Too Many Requests: What It Means and How to Fix It"
titleTemplate: false
description: "What HTTP 429 Too Many Requests means, why a server sends it, how to retry without making it worse, and how to handle it when calling a screenshot API."
headline: "HTTP 429 Too Many Requests, from both sides of the limit"
date: "2026-11-28"
keyword: "429 too many requests"
faq: [{"q": "What does 429 Too Many Requests mean?", "a": "The server is rate limiting you: you sent more requests than it allows in a period of time. RFC 6585 defines the status. Waiting and sending fewer requests fixes it."}, {"q": "How long does a 429 error last?", "a": "Until the server's window resets. If the response has a Retry-After header, it tells you how long to wait. Without one, back off and try again later."}, {"q": "Is a 429 error my fault or the server's?", "a": "It is a limit the server applies on purpose, usually per IP address, account or API key. Other users behind the same IP address can use up a shared limit too."}]
---

# HTTP 429 Too Many Requests, from both sides of the limit

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">429 Too Many Requests means you hit a rate limit. The request was fine; there were just too many of them, too fast. RFC 6585 added the status code in 2012, and every large API uses it. Here is what it means, how to back off properly, and what it looks like on Shotsnap's free endpoint, where we triggered it on purpose.</p>

## What the status says

[RFC 6585](https://www.rfc-editor.org/rfc/rfc6585#section-4) defines 429 as: the user has sent too many requests in a given amount of time. The response may say why, and it may include a `Retry-After` header saying how long to wait. The RFC leaves open how the server counts: per IP address, per account, per API key or per endpoint are all common.

[MDN's 429 page](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429) adds the practical part: the server is asking the client to slow down, and a client should respect `Retry-After` when it is there.

429 is not:

- **403 Forbidden**: you are not allowed at all, retrying will not help.
- **503 Service Unavailable**: the server itself is overloaded or down, for everyone.
- **A network error**: you got a full HTTP response, just not the one you wanted.

## What it looks like in practice

Shotsnap's [free screenshot API](/free-screenshot-api/) allows 7 requests per 10 minutes per IP address. We sent requests one after another on 28 November 2026; numbers 1 to 7 returned PNG images and number 8 returned this:

```txt
HTTP/2 429
cache-control: private, no-store, max-age=0
content-type: text/plain; charset=utf-8
server: Vercel
x-vercel-mitigated: deny
content-length: 75
```

with the body `Too Many Requests`. Two details matter for client code. The body is text, not an image. And there is no `Retry-After` header, so the client has to know the window, 10 minutes here, from the documentation.

## Fixing it as a client

**Check the status before using the body.** A 429 body is an error message. Writing it to `screenshot.png` gives you a broken file. With curl, `-f` makes it fail instead:

```bash
curl -f -o shot.png "https://shotsnap.vercel.app/api/screenshot?page=https%3A%2F%2Fexample.com&width=1280&height=720"
```

**Wait, then retry a few times at most.** Read `Retry-After` when the server sends it, and otherwise wait longer after each failure (exponential backoff):

```js
/** Seconds or an HTTP date; null when the header is missing or unreadable. */
function retryAfterMs(value) {
  if (!value) return null
  if (/^\d+$/.test(value.trim())) return Number(value) * 1000
  const date = Date.parse(value)
  return Number.isNaN(date) ? null : Math.max(0, date - Date.now())
}

async function fetchWithRetry(url, { tries = 4, fallbackMs = 1000 } = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url)
    if (res.status !== 429 || attempt === tries) return res
    const wait = retryAfterMs(res.headers.get('retry-after')) ?? fallbackMs * 2 ** (attempt - 1)
    await new Promise((resolve) => setTimeout(resolve, wait))
  }
}
```

We ran it against a local Express server that answered 429 twice, first with `Retry-After: 2` and then with an HTTP date one second ahead. The helper waited 2 seconds, then 0.8 seconds (dates only have whole-second precision), and got its 200 after 3.3 seconds.

**Spread requests out.** If you know the limit, pace yourself under it instead of hitting it and retrying. For Shotsnap that means no more than 7 screenshots per 10 minutes from one IP address, about 1,000 a day.

**Cache results.** The same URL rarely needs a new screenshot every minute. Shotsnap's successful responses already carry `Cache-Control: public, immutable, max-age=86400`.

**Do not retry in a tight loop.** Every retry inside the window is another request counted against you, and some limiters extend the block for clients that keep hammering.

## Using the shotsnap npm package

The [shotsnap](/) package (0.2.2) does not check the status code. We called `takeScreenshot` with `saveFile: true` while rate limited: it returned a 75-byte Buffer holding the text `Too Many Requests` and wrote that to the PNG file. Until that changes, check the result yourself:

```js
import { takeScreenshot } from 'shotsnap'

const image = await takeScreenshot({ pageUrl: 'https://example.com', saveFile: false })
const isPng = image.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
if (!isPng) throw new Error(`No image: ${image.toString().split('\n')[0]}`)
```

Every PNG file starts with those eight bytes, so the check is cheap and reliable.

## Fixing it as a server owner

If your own API returns 429s that users report:

- Say what the limit is, in the docs and ideally in the response.
- Send `Retry-After` so clients can wait the right amount instead of guessing.
- Pick the key on purpose. Per-IP limits punish everyone behind one office or mobile carrier address; per-key limits need sign-up.
- Return 429 rather than 403 or 500 so clients know a retry later can work.

## When the limit is too low for you

A free shared endpoint is meant for a handful of screenshots. If you need hundreds an hour, run the browser yourself: [Puppeteer or a hosted API](/puppeteer-screenshot.html) compares the two, and [screenshots on AWS Lambda](/blog/screenshots-aws-lambda) covers serverless.

## FAQ

### What does 429 Too Many Requests mean?

The server is rate limiting you: you sent more requests than it allows in a period of time. RFC 6585 defines the status. Waiting and sending fewer requests fixes it.

### How long does a 429 error last?

Until the server's window resets. If the response has a Retry-After header, it tells you how long to wait. Without one, back off and try again later.

### Is a 429 error my fault or the server's?

It is a limit the server applies on purpose, usually per IP address, account or API key. Other users behind the same IP address can use up a shared limit too.

## Related posts

- [The Retry-After header: reading it and sending it](/blog/retry-after-header)
- [Free website screenshot API: no key, one URL](/free-screenshot-api/)
- [Website screenshots on AWS Lambda without bundling Chrome](/blog/screenshots-aws-lambda)
- [All posts](/blog/)
