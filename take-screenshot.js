const { spawn } = require('child_process');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function takeWebappScreenshot() {
  let serverProcess;
  let browser;
  
  try {
    console.log('Starting webapp server...');
    
    // Start the webapp server
    serverProcess = spawn('npm', ['run', 'start:webapp'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
    });

    // Wait for server to start
    await new Promise((resolve, reject) => {
      let output = '';
      
      const timeout = setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 60000); // 60 second timeout
      
      serverProcess.stdout.on('data', (data) => {
        output += data.toString();
        console.log('Server output:', data.toString());
        
        // Look for webpack dev server ready message
        if (output.includes('webpack compiled') || output.includes('Local:') || output.includes('localhost:1212')) {
          clearTimeout(timeout);
          resolve();
        }
      });
      
      serverProcess.stderr.on('data', (data) => {
        console.error('Server error:', data.toString());
      });
      
      serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });

    // Wait a bit more for the server to fully initialize
    console.log('Server started, waiting for initialization...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Launching browser...');
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }, // HD resolution
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    const page = await context.newPage();
    
    console.log('Navigating to webapp...');
    await page.goto('http://localhost:1212', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for styles to load
    console.log('Waiting for styles to load...');
    await page.waitForTimeout(3000);
    
    // Wait for any fonts to load
    await page.waitForFunction(() => document.fonts.ready);
    
    // Take screenshot
    const screenshotPath = path.join(__dirname, 'webapp-screenshot.png');
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true,
      type: 'png'
    });
    
    console.log(`Screenshot saved to: ${screenshotPath}`);
    
    // Also check if styles are properly loaded
    const stylesCount = await page.evaluate(() => {
      return document.styleSheets.length;
    });
    console.log(`Number of stylesheets loaded: ${stylesCount}`);
    
    const hasStyles = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
             computedStyle.color !== 'rgb(0, 0, 0)';
    });
    console.log(`Styles applied: ${hasStyles}`);

    return screenshotPath;
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
    throw error;
  } finally {
    // Cleanup
    if (browser) {
      await browser.close();
    }
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      // Give it time to cleanup
      setTimeout(() => {
        if (!serverProcess.killed) {
          serverProcess.kill('SIGKILL');
        }
      }, 5000);
    }
  }
}

// Run the screenshot function
takeWebappScreenshot()
  .then((screenshotPath) => {
    console.log('Screenshot completed successfully!');
    console.log(`Screenshot saved at: ${screenshotPath}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to take screenshot:', error);
    process.exit(1);
  });