---
title: "Retry-After Header: Seconds, Dates and 429 Responses"
titleTemplate: false
description: "How the Retry-After header works with 429, 503 and redirects: its two formats, how to parse both in JavaScript, and what to do when a server leaves it out."
headline: "Reading and sending the Retry-After HTTP header"
date: "2026-11-28"
keyword: "retry-after header"
faq: [{"q": "What is the Retry-After header?", "a": "An HTTP response header that tells the client how long to wait before the next request, either as a number of seconds or as an HTTP date. RFC 9110 defines it."}, {"q": "Is Retry-After required on a 429 response?", "a": "No. RFC 6585 says a 429 response may include it. Many servers send it, some do not, and clients need a fallback wait for the second case."}, {"q": "Does fetch wait for Retry-After automatically?", "a": "No. fetch returns the 429 or 503 response to your code. Reading the header and waiting is up to you."}]
---

# Reading and sending the Retry-After HTTP header

<p class="post-meta">By <a href="https://halit.org">Halit Sever</a> · <time datetime="2026-11-28">28 November 2026</time></p>

<p class="lead">Retry-After is the header a server sends to say: come back later, and here is when. It appears on 429 Too Many Requests, on 503 Service Unavailable and on some redirects. It has two formats, and a client that handles only one of them will sooner or later wait the wrong amount of time.</p>

## The definition

[RFC 9110, section 10.2.3](https://www.rfc-editor.org/rfc/rfc9110#section-10.2.3) defines `Retry-After` as either an HTTP date or a number of seconds:

```txt
Retry-After: 120
Retry-After: Fri, 31 Dec 2027 23:59:59 GMT
```

- With a **503**, it says how long the service is expected to be unavailable.
- With a **3xx redirect**, it says how long the client should wait before following it.
- With a **429**, [RFC 6585](https://www.rfc-editor.org/rfc/rfc6585#section-4) says the response *may* include it to say how long to wait before a new request.

[MDN's Retry-After reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Retry-After) describes the same two forms.

## Parsing both forms in JavaScript

```js
/** Seconds or an HTTP date; null when the header is missing or unreadable. */
function retryAfterMs(value) {
  if (!value) return null
  if (/^\d+$/.test(value.trim())) return Number(value) * 1000
  const date = Date.parse(value)
  return Number.isNaN(date) ? null : Math.max(0, date - Date.now())
}
```

Three details in there:

1. The seconds form is a plain non-negative integer. Decimal or negative values are not valid, so the regular expression rejects them.
2. `Date.parse` reads the HTTP date format (`Sat, 28 Nov 2026 11:03:59 GMT`). The result can be in the past if the clocks disagree, hence `Math.max(0, ...)`.
3. Anything unreadable returns `null`, so the caller falls back to its own backoff.

We tested it against a local Express server that answered `Retry-After: 2` and then an HTTP date one second ahead. The waits came out as 2 seconds and 0.8 seconds; dates only carry whole seconds, so the second wait is a little shorter than the nominal one second.

## A retry loop that uses it

```js
async function fetchWithRetry(url, { tries = 4, fallbackMs = 1000, maxWaitMs = 60_000 } = {}) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url)
    if (![429, 503].includes(res.status) || attempt === tries) return res
    const hinted = retryAfterMs(res.headers.get('retry-after'))
    const wait = Math.min(hinted ?? fallbackMs * 2 ** (attempt - 1), maxWaitMs)
    await new Promise((resolve) => setTimeout(resolve, wait))
  }
}
```

`maxWaitMs` protects you from a header that says "come back in a day" while a user is waiting on a page. When the hint is longer than you are willing to wait, it is usually better to give up and show a message than to hang.

Neither `fetch` nor Node's `http` module does any of this for you. Some HTTP clients and SDKs have retry plugins that read the header; check what yours does before adding a second retry layer on top.

## When there is no Retry-After

Plenty of servers leave it out. Shotsnap's [free screenshot API](/free-screenshot-api/) is one: on 28 November 2026, its 429 response carried `cache-control`, `content-type`, `server` and `x-vercel-mitigated: deny`, but no `Retry-After`. The limit is documented instead: 7 requests per 10 minutes per IP address, in fixed windows. A client that knows the window can wait until it resets; one that does not should back off exponentially and stop after a few attempts.

## Sending Retry-After from your own server

In Express, with `limiter` standing in for whatever rate limiter you use:

```js
app.use((req, res, next) => {
  const blockedFor = limiter.secondsUntilReset(req.ip)   // your rate limiter
  if (blockedFor > 0) return res.status(429).set('Retry-After', String(blockedFor)).send('Too Many Requests')
  next()
})
```

Prefer seconds over a date: the client does not need a synced clock to use it. Send the real time left in the window rather than a constant, and keep the body short and readable, since humans read it in logs.

## Related headers

`RateLimit` and `RateLimit-Policy` are an IETF HTTPAPI working group draft for describing a quota before you run out. Several APIs already send older `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers. None of them replace `Retry-After` on the response that actually refuses you.

## FAQ

### What is the Retry-After header?

An HTTP response header that tells the client how long to wait before the next request, either as a number of seconds or as an HTTP date. RFC 9110 defines it.

### Is Retry-After required on a 429 response?

No. RFC 6585 says a 429 response may include it. Many servers send it, some do not, and clients need a fallback wait for the second case.

### Does fetch wait for Retry-After automatically?

No. fetch returns the 429 or 503 response to your code. Reading the header and waiting is up to you.

## Related posts

- [HTTP 429 Too Many Requests, from both sides of the limit](/blog/http-429-too-many-requests)
- [Free website screenshot API: no key, one URL](/free-screenshot-api/)
- [Playwright vs Puppeteer for screenshots](/blog/playwright-vs-puppeteer-screenshots)
- [All posts](/blog/)
