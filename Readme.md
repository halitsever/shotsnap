[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhalitsever%2Fshotsnap.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhalitsever%2Fshotsnap?ref=badge_shield)

<p align="left"><h3><a href="https://shotsnap.vercel.app/">ShotSnap</a></h3>
Node.js web screenshot library without any webdriver dependency<br><br>
<a href="https://www.producthunt.com/posts/shotsnap?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-shotsnap" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=361871&theme=light" alt="Shotsnap - screenshot&#0044;&#0032;web&#0032;capture | Product Hunt" height="30" /></a>
</p>
<p align="right"><img src="https://i.ibb.co/3dMGNbQ/9179fcb5-b9e2-4a34-be0a-80c4318ac199.png"></p>
<h2 align="center">Usage</h2> 
<p align="center">

<code align="center">
const shotSnap = require("shotsnap");</code><br>
<code align="center">
shotSnap.takeScreenshot({ pageUrl: 'https://google.com', saveFile: true, fileName: 'test.png' });
</code><br><br>
<b>Result:</b><br>
<img height="500px" src="https://i.ibb.co/W6JKvnz/screenshot-1.png">
</p>

<p align="center">
<b>Props:</b> <br>
<code>pageUrl: The page url you want to screenshot from</code><br>
<code>saveFile: true or false </code><br>
<code>fileName: filename for saving file</code><br>
<code>screenSize: array contains height and width (default 820*768)</code>

</p>

<h2 align="center">Sponsors</h2>
<p align="center"><a href="https://papadigi.com/"><img height="100" src="https://i.ibb.co/w0xTp4N/Whats-App-Image-2022-10-08-at-16-30-55.jpg"></a></p>


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fhalitsever%2Fshotsnap.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fhalitsever%2Fshotsnap?ref=badge_large)