import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();
app.use(cors());

// 🔗 던담 기본 URL
const BASE = "https://dundam.xyz/character?server=";

// 전투력 + 버프력 크롤링
app.get("/character/:server/:key", async (req, res) => {
  try {
    const { server, key } = req.params;
    const url = `${BASE}${server}&key=${key}`;

    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);

    // 전투력(딜)
    const combat = $("div:contains('딜')").next().text().trim();

    // 버프력
    const buff = $("div:contains('버프')").next().text().trim();

    res.json({
      server,
      key,
      combat: combat || "NoData",
      buff: buff || "NoData"
    });
  } catch (e) {
    res.json({ error: "ServerError", detail: e.toString() });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("running", port));
