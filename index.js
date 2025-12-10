import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// 던담 기본 URL
const BASE_URL = "https://dundam.xyz/character";

// 전투력 가져오기
// 예시: /character?server=prey&key=eda77b9d67e1dd68efc8836cebc18b7c
app.get("/character", async (req, res) => {
  try {
    const server = req.query.server;
    const id = req.query.key;

    if (!server || !id) {
      return res.status(400).json({ error: "server or key is missing" });
    }

    const url = `${BASE_URL}?server=${encodeURIComponent(server)}&key=${encodeURIComponent(id)}`;
    const html = await fetch(url).then(r => r.text());

    const match = html.match(/window\.__NUXT__=(.*?);<\/script>/);
    if (!match) return res.json({ error: "NoData" });

    const data = JSON.parse(match[1]);

    // 전투력
    const power = data?.state?.data?.damage?.totalDamage;
    // 버프력
    const buff = data?.state?.data?.buffInfo?.totalBuffPower;

    // 응답에 둘 다 넣어놓으면, 필요한 값만 꺼내서 쓸 수 있음
    return res.json({
      id,
      combat: power ?? "NoData",
      buff: buff ?? "NoData"
    });
  } catch (err) {
    return res.status(500).json({ error: "ServerError", detail: err.toString() });
  }
});

// 기본 포트
const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Server running on port ${port}`));
