---
title: Taking Screenshot From A Website
description: "Take a screenshot of a website from its URL in Node.js with shotsnap and save it to a PNG file."
---

**Simple example**

```javascript
// import the module
const shotSnap = require("shotsnap");
// take screenshot
shotSnap.takeScreenshot({
  pageUrl: "https://google.com",
  saveFile: true,
  fileName: "test.png",
});
```

**Result:**
<img src="https://i.ibb.co/W6JKvnz/screenshot-1.png" style="border-radius:20px;"/>

**How it works?**
When you run this code this requests going to browser on cloud, its creates a new browser instance and take a screenshot.
If you make too many requests you can be rate-limited.

```

```
