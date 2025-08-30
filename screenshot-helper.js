const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function takeScreenshotWithBrowser() {
  // Create a simple HTML file that will load the app in an iframe and take a screenshot
  const screenshotHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Screenshot Helper</title>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #webapp-frame { 
            width: 1920px; 
            height: 1080px; 
            border: none; 
            transform: scale(1);
            transform-origin: 0 0;
        }
    </style>
</head>
<body>
    <iframe id="webapp-frame" src="http://localhost:1212"></iframe>
    <script>
        // Wait for frame to load then take screenshot
        document.getElementById('webapp-frame').onload = function() {
            setTimeout(() => {
                console.log('Frame loaded, ready for screenshot');
            }, 3000);
        };
    </script>
</body>
</html>`;

  const screenshotPath = path.join(__dirname, 'screenshot-helper.html');
  fs.writeFileSync(screenshotPath, screenshotHTML);
  
  console.log('Created screenshot helper at:', screenshotPath);
  console.log('Open this file in a browser and manually take a screenshot');
  console.log('The webapp should be visible at: http://localhost:1212');
  
  return screenshotPath;
}

takeScreenshotWithBrowser()
  .then((path) => {
    console.log('Screenshot helper created at:', path);
  })
  .catch(console.error);