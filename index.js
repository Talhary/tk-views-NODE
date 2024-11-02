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
  const views = req.query.views
  if (!tiktokUrl) {
    return res.status(400).json({ error: "URL is required as a query parameter" });
  }

  try {
    for (let i = 0; i < parseInt(views); i++) {
      await watchTiktokVid(tiktokUrl);
    }
    res.json({ message: "Watched the video 100 times" });
  } catch (error) {
    console.error("Error watching video:", error);
    res.status(500).json({ error: "Failed to watch the video" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
