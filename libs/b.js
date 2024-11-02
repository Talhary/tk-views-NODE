import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Use the stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// Function to introduce a delay
async function delay(s) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

let browser = null;

export const runTiktokBrowser = async () => {
  try {
    // Launch Puppeteer with randomized configurations to prevent detection
    browser = await puppeteer.launch({
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--window-size=${1280 + Math.floor(Math.random() * 50)},${800 + Math.floor(Math.random() * 50)}`,
      ],
    });

    const page = await browser.newPage();

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
    await page.keyboard.type("Hello TikTok!", { delay: 100 });

     
        await page.goto('https://www.tiktok.com/en', { waitUntil: 'networkidle2' });
        await page.mouse.move(100, 200); await page.mouse.move(150, 250, { steps: 10 }); await page.keyboard.type('Hello World', { delay: 100 });
        await page.click('[id="header-login-button"]')
        await delay(3)
        await page.click('text=Use phone / email / username');
        await delay(1)
        await page.click('[href="/login/phone-or-email/email"]')
        await delay(1)
        await page.type('[placeholder="Email or username"]', 'jacoobit@gmail.com');
        await delay(1)

        await page.type('[placeholder="Password"]', 'Talha54321-');
        await delay(1)


        await page.click('[data-e2e="login-button"]')
        await delay(1)

        await page.waitForSelector('[data-e2e="profile-icon"]');


    return browser;
  } catch (err) {
    console.error("Error launching Puppeteer:", err);
    return { err: true, msg: err.message };
  }
};
// export const watchTiktokVid = async (url) => {
//     try {
//         if(!browser) await runTiktokBrowser()
//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: 'networkidle2' });
//         await delay(5);
//         await page.close();
//     } catch (error) {
//         console.error(error);
//     }
// }
