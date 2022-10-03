
<h1 align="center"><img height="40px" src="https://ph-files.imgix.net/9179fcb5-b9e2-4a34-be0a-80c4318ac199.png?auto=format&auto=compress&codec=mozjpeg&cs=strip&w=72&h=72&fit=crop&bg=0fff&dpr=2">
ShotSnap</h1> 

<p align="center">
Node.js web screenshot library without any webdriver dependency
<br>
<b>Usage:</b>
<br>
<code align="center">
const shotSnap = require("shotsnap");</code><br>
<code align="center">
shotSnap.takeScreenshot({ pageUrl: 'https://google.com', saveFile: true, fileName: 'test.png' });
</code><br><br>
<b>Result:</b><br>
<img height="500px" src="https://i.ibb.co/cQtvpqp/screenshot.png">
</p>

<p align="center">
<b>Props:</b> <br>
<code>pageUrl: The page url you want to screenshot from</code><br>
<code>saveFile: true or false </code><br>
<code>fileName: filename for saving file</code><br>
<code>screenSize: array contains height and width (default 820*768)</code>

</p>
<p align="center">
<a href="https://www.producthunt.com/posts/shotsnap?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-shotsnap" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=361871&theme=light" alt="Shotsnap - screenshot&#0044;&#0032;web&#0032;capture | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>
</p>
