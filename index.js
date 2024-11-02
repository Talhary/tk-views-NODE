import express from "express";
import { runTiktokBrowser, watchTiktokVid } from "./libs/browser.js";
import 'dotenv/config'
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(express.static('public'))
runTiktokBrowser()
// Route to watch a TikTok video 100 times

app.get("/watch-video", async (req, res) => {
    const tiktokUrl = req.query.url;
    const views = parseInt(req.query.views, 10);
    
    if (!tiktokUrl || isNaN(views)) {
      return res.status(400).json({ error: "Valid URL and views count are required as query parameters" });
    }
  
    try {
      // Function to handle 50 parallel views
      const batchWatch = async (batchSize, totalViews) => {
        for (let i = 0; i < totalViews; i += batchSize) {
          const batch = Array(batchSize).fill(tiktokUrl).map(url => watchTiktokVid(url));
          await Promise.all(batch); // Wait until all 50 views are completed before moving to the next batch
        }
      };
  
      await batchWatch(50, views);
  
      res.json({ message: `Watched the video ${views} times` });
    } catch (error) {
      console.error("Error watching video:", error);
      res.status(500).json({ error: "Failed to watch the video" });
    }
  });
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
