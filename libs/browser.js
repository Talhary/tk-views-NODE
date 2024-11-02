import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import chromium from "@sparticuz/chromium";
// Use the stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// Function to introduce a delay
async function delay(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

let browser = null;

// Initialize the browser instance
export const runTiktokBrowser = async () => {
  try {
    browser = await puppeteer.launch({
     headless: chromium.headless,
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--window-size=${1280 + Math.floor(Math.random() * 50)},${800 + Math.floor(Math.random() * 50)}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
      executablePath: await chromium.executablePath(),
    });
    return browser;
  } catch (err) {
    console.error("Error launching Puppeteer:", err);
    return { err: true, msg: err.message };
  }
};

// Configure each new page to avoid detection
async function setupPage(page) {
  // Set a realistic User-Agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
  );

  // Randomize viewport size
  await page.setViewport({
    width: 1280 + Math.floor(Math.random() * 100),
    height: 800 + Math.floor(Math.random() * 100),
  });

  // Set up request interception to block tracking and analytics scripts
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const url = req.url();
    if (
      url.includes("analytics") ||
      url.includes("tracking") ||
      url.includes("ads") ||
      url.includes("collect") ||
      url.includes("google-analytics")
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // Spoof WebGL and other properties to avoid detection
  await page.evaluateOnNewDocument(() => {
    // Set navigator.webdriver to false
    Object.defineProperty(navigator, "webdriver", { get: () => false });

    // Spoof WebGL Vendor and Renderer
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (parameter) {
      if (parameter === 37445) return "Intel Inc.";
      if (parameter === 37446) return "Intel Iris OpenGL Engine";
      return getParameter(parameter);
    };

    // Set time zone spoofing
    Object.defineProperty(Intl.DateTimeFormat.prototype, "resolvedOptions", {
      value: () => ({ timeZone: "America/New_York" }),
    });
  });

  // Set additional headers to mimic real user behavior
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  // Set Geolocation to a specific location
  await page.setGeolocation({ latitude: 40.7128, longitude: -74.0060 });

  // Perform random mouse movements and keyboard interactions
  await page.mouse.move(500 + Math.random() * 100, 200 + Math.random() * 100, { steps: 10 });
}

// Open the page and watch the TikTok video, using anti-detection techniques
export const watchTiktokVid = async (url) => {
  try {
    if (!browser) await runTiktokBrowser();
    const page = await browser.newPage();
    
    // Apply anti-detection techniques to each page
    await setupPage(page);

    await page.goto(url, { waitUntil: 'networkidle2' });
    await delay(5);
    await page.close();
  } catch (error) {
    console.error("Error watching video:", error);
  }
};
