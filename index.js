import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const BASE_URL = "https://dundam.xyz/character";

// 전투력 가져오기
app.get("/character/:server/:id/combat", async (req, res) => {
  try {
    const { server, id } = req.params;
    const url = `${BASE_URL}?server=${server}&key=${id}`;
    const html = await fetch(url).then(r => r.text());

    const match = html.match(/window\.__NUXT__=(.*?);<\/script>/);
    if (!match) return res.json({ error: "NoData" });

    const data = JSON.parse(match[1]);
    const power = data?.state?.data?.damage?.totalDamage;

    res.json({ id, combat: power ?? "NoData" });
  } catch (err) {
    res.json({ error: "ServerError", detail: err.toString() });
  }
});

// 버프력 가져오기
app.get("/character/:server/:id/buff", async (req, res) => {
  try {
    const { server, id } = req.params;
    const url = `${BASE_URL}?server=${server}&key=${id}`;
    const html = await fetch(url).then(r => r.text());

    const match = html.match(/window\.__NUXT__=(.*?);<\/script>/);
    if (!match) return res.json({ error: "NoData" });

    const data = JSON.parse(match[1]);
    const buff = data?.state?.data?.buffInfo?.totalBuffPower;

    res.json({ id, buff: buff ?? "NoData" });
  } catch (err) {
    res.json({ error: "ServerError", detail: err.toString() });
  }
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Server running on port ${port}`));
